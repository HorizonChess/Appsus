import { mailService } from '../services/mail.service.js'

export function MailPreview({ mail, onToggleStar, onSelectMail, onRemoveMail }) {
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

    return <li
        className={`mail-preview ${isRead ? 'is-read' : 'is-unread'}`}
        onClick={() => onSelectMail(mail.id)}>

        <button
            className="star-btn"
            title={isStared ? 'Starred' : 'Not starred'}
            onClick={onStarClick}>
            <i className={isStared ? 'fa-solid fa-star is-stared' : 'fa-regular fa-star'}></i>
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
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>

    </li>
}
