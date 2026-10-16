import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, title, onScroll, selectedIds, onToggleSelect, onToggleStar, onSetRead, onClickMail, onRemoveMail }) {
    if (!mails.length) return <p className="mail-list-empty">No mails found</p>

    // the title scrolls away with the rows, the way gmail's does on a phone
    return <ul className="mail-list" onScroll={onScroll}>
        {title && <li className="mail-list-title">{title}</li>}
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
