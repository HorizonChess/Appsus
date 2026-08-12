import { mailService } from '../services/mail.service.js'

export function MailPreview({ mail, onToggleStar }) {
    const { subject, body, from, fromName, isRead, isStared, labels = [] } = mail
    const sentAt = mail.sentAt || mail.createdAt

    function onStarClick(ev) {
        ev.stopPropagation()
        onToggleStar(mail.id)
    }

    return <li className={`mail-preview ${isRead ? 'is-read' : 'is-unread'}`}>

        <button
            className="star-btn"
            title={isStared ? 'Starred' : 'Not starred'}
            onClick={onStarClick}>
            <i className={isStared ? 'fa-solid fa-star is-stared' : 'fa-regular fa-star'}></i>
        </button>

        <span className="mail-sender">{fromName || from}</span>

        <div className="mail-txt">
            {labels.map(label => (
                <span key={label} className={`label-chip label-${label}`}>{label}</span>
            ))}
            <span className="mail-subject">{subject}</span>
            <span className="mail-snippet"> - {body}</span>
        </div>

        <span className="mail-date">{mailService.formatMailDate(sentAt)}</span>

    </li>
}
