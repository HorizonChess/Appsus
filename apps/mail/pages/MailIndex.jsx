import { mailService, PAGE_SIZE } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailToolbar } from '../cmps/MailToolbar.jsx'

const { useState, useEffect } = React
const { useSearchParams, useNavigate } = ReactRouterDOM

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const folder = searchParams.get('folder') || 'inbox'
    const txt = searchParams.get('txt') || ''
    // no defaults here - query merges getDefaultFilter over whatever is missing
    const sortBy = searchParams.get('sortBy')
    const sortDir = searchParams.get('sortDir')
    const pageIdx = +searchParams.get('pageIdx') || 0

    // clamped, so emptying the last page or narrowing the folder cannot strand you
    const pageCount = mails ? Math.max(Math.ceil(mails.length / PAGE_SIZE), 1) : 1
    const pageIdxToShow = Math.min(Math.max(pageIdx, 0), pageCount - 1)
    const pageMails = mails && mails.slice(pageIdxToShow * PAGE_SIZE, (pageIdxToShow + 1) * PAGE_SIZE)

    // a folder switch drops the old rows right away - the loader covers the gap
    useEffect(() => {
        setMails(null)
    }, [folder])

    useEffect(() => {
        loadMails()
        return eventBusService.on('mails-changed', loadMails)
    }, [folder, txt, sortBy, sortDir])

    function loadMails() {
        mailService.query({ folder, txt, sortBy, sortDir })
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
            .filter(mail => mailService.isInFolder(mail, folder)))
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

        <MailFilter />

        <MailFolderList />

        <main className="mail-content">
            <MailToolbar
                total={mails ? mails.length : 0}
                pageIdx={pageIdxToShow}
                pageCount={pageCount} />

            {!mails && <div className="loader"></div>}

            {mails && <MailList
                mails={pageMails}
                onToggleStar={onToggleStar}
                onSetRead={onSetRead}
                onSelectMail={onSelectMail}
                onRemoveMail={onRemoveMail} />}
        </main>

        <MailCompose />

    </section>
}
