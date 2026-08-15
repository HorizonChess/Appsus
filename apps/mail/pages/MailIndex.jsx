import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    // which mail is open lives in the URL, not in state
    const selectedMailId = searchParams.get('mailId')

    useEffect(() => {
        loadMails()
    }, [])

    function loadMails() {
        mailService.query({ status: 'inbox' })
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    // optimistic - the storage service costs 500ms per call and toggleStar makes
    // two, so we flip it in state now and restore the old list if the save fails
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

        markAsRead(mailId)
    }

    function onCloseMail() {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('mailId')
        setSearchParams(nextParams)
    }

    function markAsRead(mailId) {
        const mailToRead = mails.find(mail => mail.id === mailId)
        if (!mailToRead || mailToRead.isRead) return

        const prevMails = mails

        setMails(mails.map(mail => (
            mail.id === mailId ? { ...mail, isRead: true } : mail
        )))

        mailService.toggleRead(mailId)
            .catch(err => {
                console.log('Had issues marking mail as read', err)
                setMails(prevMails)
            })
    }

    if (!mails) return <section className="mail-index">Loading...</section>

    return <section className="mail-index">
        {selectedMailId
            ? <MailDetails mailId={selectedMailId} onCloseMail={onCloseMail} />
            : <MailList mails={mails} onToggleStar={onToggleStar} onSelectMail={onSelectMail} />}
    </section>
}
