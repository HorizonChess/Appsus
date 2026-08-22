import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, selectedIds, onToggleSelect, onToggleStar, onSetRead, onClickMail, onRemoveMail }) {
    if (!mails.length) return <p className="mail-list-empty">No mails found</p>

    return <ul className="mail-list">
        {mails.map(mail => (
            <MailPreview
                key={mail.id}
                mail={mail}
                isSelected={selectedIds.includes(mail.id)}
                onToggleSelect={onToggleSelect}
                onToggleStar={onToggleStar}
                onSetRead={onSetRead}
                onClickMail={onClickMail}
                onRemoveMail={onRemoveMail} />
        ))}
    </ul>
}
