import { mailService } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'

const { useState, useEffect } = React
const { useSearchParams, useNavigate } = ReactRouterDOM

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const status = searchParams.get('status') || 'inbox'

    useEffect(() => {
        loadMails()
        return eventBusService.on('mails-changed', () => loadMails(false))
    }, [status])

    // the loader is only for a folder switch - a refresh keeps the old rows up
    // until the new ones arrive, so the list never blinks mid-action
    function loadMails(isFolderSwitch = true) {
        if (isFolderSwitch) setMails(null)

        mailService.query({ status })
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    function onToggleStar(mailId) {
        const prevMails = mails
        const isStared = !mails.find(mail => mail.id === mailId).isStared

        applyChange(mailId, { isStared })

        mailService.toggleStar(mailId, isStared)
            .catch(err => {
                console.log('Had issues starring mail', err)
                setMails(prevMails)
            })
    }

    function applyChange(mailId, changes) {
        setMails(mails
            .map(mail => (mail.id === mailId ? { ...mail, ...changes } : mail))
            .filter(mail => mailService.isInFolder(mail, status)))
    }

    // the folder rides along in the query string so details can hand it back
    function onSelectMail(mailId) {
        navigate(`/mail/${mailId}?${searchParams}`)
    }

    // the service decides trash-vs-destroy, we just drop it from the current view
    function onRemoveMail(mailId) {
        const prevMails = mails

        setMails(mails.filter(mail => mail.id !== mailId))

        mailService.remove(mailId)
            .catch(err => {
                console.log('Had issues removing mail', err)
                setMails(prevMails)
            })
    }

    function onSetRead(mailId, isRead) {
        const prevMails = mails

        applyChange(mailId, { isRead })

        mailService.toggleRead(mailId, isRead)
            .catch(err => {
                console.log('Had issues updating read state', err)
                setMails(prevMails)
            })
    }

    return <section className="mail-index">

        <MailFolderList />

        <main className="mail-content">
            {!mails && <div className="loader"></div>}

            {mails && <MailList
                mails={mails}
                onToggleStar={onToggleStar}
                onSetRead={onSetRead}
                onSelectMail={onSelectMail}
                onRemoveMail={onRemoveMail} />}
        </main>

        <MailCompose />

    </section>
}
