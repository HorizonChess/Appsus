import { mailService } from '../services/mail.service.js'

const { useState, useEffect } = React

export function MailDetails({ mailId, onCloseMail }) {
    const [mail, setMail] = useState(null)

    useEffect(() => {
        loadMail()
    }, [mailId])

    function loadMail() {
        mailService.get(mailId)
            .then(setMail)
            .catch(err => console.log('Had issues loading mail', err))
    }

    if (!mail) return <section className="mail-details">Loading...</section>

    const { subject, body, from, fromName } = mail
    const sentAt = mail.sentAt || mail.createdAt

    return <section className="mail-details">

        <button className="back-btn" title="Back to list" onClick={onCloseMail}>
            <i className="fa-solid fa-arrow-left"></i>
        </button>

        <h2 className="mail-details-subject">{subject}</h2>

        <div className="mail-details-from">
            <span className="mail-details-sender">{fromName || from}</span>
            <span className="mail-details-address">{from}</span>
            <span className="mail-details-date">{mailService.formatMailDate(sentAt)}</span>
        </div>

        <p className="mail-details-body">{body}</p>

    </section>
}
