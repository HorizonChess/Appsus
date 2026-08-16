import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

// everything compose puts in the url, so closing it can clear the lot
const COMPOSE_PARAMS = ['compose', 'to', 'subject', 'body']

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [counts, setCounts] = useState({})
    const [searchParams, setSearchParams] = useSearchParams()

    // no status in the url means inbox, so a bare #/mail still works
    const status = searchParams.get('status') || 'inbox'

    // which mail is open lives in the URL, not in state
    const selectedMailId = searchParams.get('mailId')

    // 'new' | a draft id | null when the modal is closed
    const composeId = searchParams.get('compose')

    useEffect(() => {
        loadMails()
        loadCounts()
    }, [status])

    function loadMails() {
        setMails(null)

        mailService.query({ status })
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    // counts span every folder, so they only refresh once a write has landed -
    // reading them straight after an optimistic setMails would read stale storage
    function loadCounts() {
        mailService.getFolderCounts()
            .then(setCounts)
            .catch(err => console.log('Had issues loading folder counts', err))
    }

    
    function onToggleStar(mailId) {
        const prevMails = mails
        const isStared = !mails.find(mail => mail.id === mailId).isStared

        applyChange(mailId, { isStared })

        mailService.toggleStar(mailId, isStared)
            .then(loadCounts)
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

    function onSelectMail(mailId) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('mailId', mailId)
        setSearchParams(nextParams)

        onSetRead(mailId, true)
    }

    // the service decides trash-vs-destroy, we just drop it from the current view
    function onRemoveMail(mailId) {
        const prevMails = mails

        setMails(mails.filter(mail => mail.id !== mailId))
        if (selectedMailId === mailId) onCloseMail()

        mailService.remove(mailId)
            .then(loadCounts)
            .catch(err => {
                console.log('Had issues removing mail', err)
                setMails(prevMails)
            })
    }

    function onCloseMail() {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('mailId')
        setSearchParams(nextParams)
    }

    // switching folder drops the open mail, otherwise details would still show a
    // mail that no longer belongs to the list behind it
    function onSetStatus(nextStatus) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('status', nextStatus)
        nextParams.delete('mailId')
        setSearchParams(nextParams)
    }

    function onOpenCompose() {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('compose', 'new')
        setSearchParams(nextParams)
    }

    // the prefill params go too, or reopening compose refills the old values
    function onCloseCompose() {
        const nextParams = new URLSearchParams(searchParams)
        COMPOSE_PARAMS.forEach(param => nextParams.delete(param))
        setSearchParams(nextParams)
    }

    // ?compose=new&to=..&subject=..&body=.. - how a note becomes a mail
    function getComposePrefill() {
        return {
            to: searchParams.get('to') || '',
            subject: searchParams.get('subject') || '',
            body: searchParams.get('body') || '',
        }
    }

    function onSetRead(mailId, isRead) {
        const prevMails = mails

        applyChange(mailId, { isRead })

        mailService.toggleRead(mailId, isRead)
            .then(loadCounts)
            .catch(err => {
                console.log('Had issues updating read state', err)
                setMails(prevMails)
            })
    }

    return <section className="mail-index">

        <MailFolderList
            activeStatus={status}
            counts={counts}
            onSetStatus={onSetStatus}
            onOpenCompose={onOpenCompose} />

        <main className="mail-content">
            {!mails && <div className="loader"></div>}

            {mails && (selectedMailId
                ? <MailDetails mailId={selectedMailId} onCloseMail={onCloseMail} onRemoveMail={onRemoveMail} />
                : <MailList
                    mails={mails}
                    onToggleStar={onToggleStar}
                    onSetRead={onSetRead}
                    onSelectMail={onSelectMail}
                    onRemoveMail={onRemoveMail} />)}
        </main>

        {composeId && <MailCompose
            composeId={composeId}
            prefill={getComposePrefill()}
            onCloseCompose={onCloseCompose} />}

    </section>
}
