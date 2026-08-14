import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, onToggleStar, onSelectMail }) {
    if (!mails.length) return <p className="mail-list-empty">No mails found</p>

    return <ul className="mail-list">
        {mails.map(mail => (
            <MailPreview
                key={mail.id}
                mail={mail}
                onToggleStar={onToggleStar}
                onSelectMail={onSelectMail} />
        ))}
    </ul>
}
