import { mailService } from '../services/mail.service.js'
import { MailLabelChip } from './MailLabelChip.jsx'

export function MailPreview({ mail, isSelected, onToggleSelect, onToggleStar, onSetRead, onClickMail, onRemoveMail }) {
    const { subject, body, from, fromName, isRead, isStared } = mail
    const sentAt = mail.sentAt || mail.createdAt
    const labels = mail.labels || []

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
        className={`mail-preview ${isRead ? 'is-read' : 'is-unread'} ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onClickMail(mail.id)}>

        <input
            type="checkbox"
            className="mail-check mail-preview-check"
            title="Select"
            checked={isSelected}
            onClick={ev => ev.stopPropagation()}
            onChange={() => onToggleSelect(mail.id)} />

        <button
            className="star-btn"
            title={isStared ? 'Starred' : 'Not starred'}
            onClick={onStarClick}>
            <span className={`material-symbols-outlined ${isStared ? 'is-stared' : ''}`}>star</span>
        </button>

        <span className="mail-sender">{fromName || from}</span>

        <div className="mail-txt">
            {labels.map(label => <MailLabelChip key={label} label={label} />)}

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
