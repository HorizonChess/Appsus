import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'

const { useState, useEffect } = React

export function MailIndex() {
    const [mails, setMails] = useState(null)

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

    if (!mails) return <section className="mail-index">Loading...</section>

    return <section className="mail-index">
        <MailList mails={mails} onToggleStar={onToggleStar} />
    </section>
}
