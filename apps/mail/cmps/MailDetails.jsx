import { mailService } from '../services/mail.service.js'

const { useState, useEffect } = React

export function MailDetails({ mailId, onCloseMail, onRemoveMail, onToggleStar, onSetRead }) {
    const [mail, setMail] = useState(null)

    useEffect(() => {
        loadMail()
    }, [mailId])

    function loadMail() {
        mailService.get(mailId)
            .then(setMail)
            .catch(err => console.log('Had issues loading mail', err))
    }

    // the list owns the real state, but details holds its own copy - without this
    // the star would not repaint until the mail was reopened
    function onStarClick() {
        setMail(prevMail => ({ ...prevMail, isStared: !prevMail.isStared }))
        onToggleStar(mailId)
    }

    // gmail drops you back to the list when you mark an open mail unread
    function onUnreadClick() {
        onSetRead(mailId, false)
        onCloseMail()
    }

    if (!mail) return <section className="mail-details"><div className="loader"></div></section>

    const { subject, body, from, fromName, isStared } = mail
    const sentAt = mail.sentAt || mail.createdAt
    const senderName = fromName || from

    return <section className="mail-details">

        <div className="mail-details-toolbar">
            <button className="mail-icon-btn" title="Back to list" onClick={onCloseMail}>
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <button className="mail-icon-btn" title="Delete" onClick={() => onRemoveMail(mailId)}>
                <span className="material-symbols-outlined">delete</span>
            </button>

            <button className="mail-icon-btn" title="Mark as unread" onClick={onUnreadClick}>
                <span className="material-symbols-outlined">mark_email_unread</span>
            </button>
        </div>

        <h2 className="mail-details-subject">{subject}</h2>

        <header className="mail-details-header">
            <div className="mail-details-avatar">{senderName.charAt(0).toUpperCase()}</div>

            <div className="mail-details-from">
                <span className="mail-details-sender">{senderName}</span>
                <span className="mail-details-address">&lt;{from}&gt;</span>
            </div>

            <span className="mail-details-date">{mailService.formatMailDate(sentAt)}</span>

            <button
                className="mail-icon-btn"
                title={isStared ? 'Starred' : 'Not starred'}
                onClick={onStarClick}>
                <span className={`material-symbols-outlined ${isStared ? 'is-stared' : ''}`}>star</span>
            </button>
        </header>

        <p className="mail-details-body">{body}</p>

        <footer className="mail-details-reply">
            <button className="mail-reply-btn">
                <span className="material-symbols-outlined">reply</span>
                <span>Reply</span>
            </button>

            <button className="mail-reply-btn">
                <span className="material-symbols-outlined">forward</span>
                <span>Forward</span>
            </button>
        </footer>

    </section>
}
