import { mailService } from '../services/mail.service.js'

export function MailPreview({ mail, onToggleStar, onSetRead, onSelectMail, onRemoveMail }) {
    const { subject, body, from, fromName, isRead, isStared, labels = [] } = mail
    const sentAt = mail.sentAt || mail.createdAt

    function onStarClick(ev) {
        ev.stopPropagation()
        onToggleStar(mail.id)
    }

    function onRemoveClick(ev) {
        ev.stopPropagation()
        onRemoveMail(mail.id)
    }

    function onReadClick(ev) {
        ev.stopPropagation()
        onSetRead(mail.id, !isRead)
    }

    return <li
        className={`mail-preview ${isRead ? 'is-read' : 'is-unread'}`}
        onClick={() => onSelectMail(mail.id)}>

        <button
            className="star-btn"
            title={isStared ? 'Starred' : 'Not starred'}
            onClick={onStarClick}>
            <span className={`material-symbols-outlined ${isStared ? 'is-stared' : ''}`}>star</span>
        </button>

        <span className="mail-sender">{fromName || from}</span>

        <div className="mail-txt">
            {labels.map(label => (
                <span
                    key={label}
                    className="label-chip"
                    style={{ backgroundColor: `var(--mail-label-${label})` }}>{label}</span>
            ))}
            <span className="mail-subject">{subject}</span>
            <span className="mail-snippet"> - {body}</span>
        </div>

        <div className="mail-end">
            <span className="mail-date">{mailService.formatMailDate(sentAt)}</span>

            <div className="mail-actions">
                <button className="mail-icon-btn" title="Delete" onClick={onRemoveClick}>
                    <span className="material-symbols-outlined">delete</span>
                </button>

                <button
                    className="mail-icon-btn"
                    title={isRead ? 'Mark as unread' : 'Mark as read'}
                    onClick={onReadClick}>
                    <span className="material-symbols-outlined">{isRead ? 'mark_email_unread' : 'mark_email_read'}</span>
                </button>
            </div>
        </div>

    </li>
}
