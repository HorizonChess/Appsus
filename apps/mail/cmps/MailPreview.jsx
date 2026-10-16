import { mailService } from '../services/mail.service.js'
import { MailLabelChip } from './MailLabelChip.jsx'

// android's letter tile colours - what a google app paints behind a sender with
// no photo. the same sender always lands on the same one
const AVATAR_COLORS = [
    'rgb(219, 68, 55)', 'rgb(233, 30, 99)', 'rgb(156, 39, 176)', 'rgb(103, 58, 183)',
    'rgb(63, 81, 181)', 'rgb(66, 133, 244)', 'rgb(3, 155, 229)', 'rgb(0, 151, 167)',
    'rgb(0, 150, 136)', 'rgb(15, 157, 88)', 'rgb(104, 159, 56)', 'rgb(239, 108, 0)',
    'rgb(255, 87, 34)', 'rgb(117, 117, 117)',
]

function getAvatarColor(name) {
    const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

// material symbols' check, inline because the self hosted font is a subset
// that does not carry it
function CheckIcon() {
    return <svg className="mail-avatar-check" viewBox="0 -960 960 960" aria-hidden="true">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="currentColor" />
    </svg>
}

export function MailPreview({ mail, isSelected, onToggleSelect, onToggleStar, onSetRead, onClickMail, onRemoveMail }) {
    const { subject, body, from, fromName, isRead, isStared } = mail
    const sentAt = mail.sentAt || mail.createdAt
    const labels = mail.labels || []
    const senderName = fromName || from

    function onSelectClick(ev) {
        ev.stopPropagation()
        onToggleSelect(mail.id)
    }

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

        {/* a phone's stand in for the checkbox - css shows one or the other */}
        <button
            className="mail-avatar"
            role="checkbox"
            aria-checked={isSelected}
            title="Select"
            style={{ '--avatar-clr': getAvatarColor(senderName) }}
            onClick={onSelectClick}>
            {isSelected ? <CheckIcon /> : senderName.charAt(0).toUpperCase()}
        </button>

        <button
            className="mail-check mail-preview-check"
            role="checkbox"
            aria-checked={isSelected}
            title="Select"
            onClick={onSelectClick}>
            <span className="material-symbols-outlined">{isSelected ? 'check_box' : 'check_box_outline_blank'}</span>
        </button>

        <button
            className="star-btn"
            title={isStared ? 'Starred' : 'Not starred'}
            onClick={onStarClick}>
            <span className={`material-symbols-outlined ${isStared ? 'is-stared' : ''}`}>star</span>
        </button>

        <span className="mail-sender">{senderName}</span>

        <div className="mail-txt">
            {labels.map(label => <MailLabelChip key={label} label={label} />)}

            <span className="mail-subject">{subject}</span>
            {/* the dash in front is css, so a phone - where the snippet has a line
                of its own - can drop it */}
            <span className="mail-snippet">{body}</span>
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
