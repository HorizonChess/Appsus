import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    // which mail is open lives in the URL, not in state
    const selectedMailId = searchParams.get('mailId')

    // 'new' | a draft id | null when the modal is closed
    const composeId = searchParams.get('compose')

    useEffect(() => {
        loadMails()
    }, [])

    function loadMails() {
        mailService.query({ status: 'inbox' })
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    
    function onToggleStar(mailId) {
        const prevMails = mails

        setMails(mails.map(mail => (
            mail.id === mailId ? { ...mail, isStared: !mail.isStared } : mail
        )))

        mailService.toggleStar(mailId)
            .catch(err => {
                console.log('Had issues starring mail', err)
                setMails(prevMails)
            })
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

    // the prefill params go too, or reopening compose refills the old values
    function onCloseCompose() {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('compose')
        nextParams.delete('to')
        nextParams.delete('subject')
        nextParams.delete('body')
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

        setMails(mails.map(mail => (
            mail.id === mailId ? { ...mail, isRead } : mail
        )))

        mailService.toggleRead(mailId, isRead)
            .catch(err => {
                console.log('Had issues updating read state', err)
                setMails(prevMails)
            })
    }

    if (!mails) return <section className="mail-index"><div className="loader"></div></section>

    return <section className="mail-index">
        {selectedMailId
            ? <MailDetails mailId={selectedMailId} onCloseMail={onCloseMail} onRemoveMail={onRemoveMail} />
            : <MailList
                mails={mails}
                onToggleStar={onToggleStar}
                onSetRead={onSetRead}
                onSelectMail={onSelectMail}
                onRemoveMail={onRemoveMail} />}

        {composeId && <MailCompose
            composeId={composeId}
            prefill={getComposePrefill()}
            onCloseCompose={onCloseCompose} />}
    </section>
}
