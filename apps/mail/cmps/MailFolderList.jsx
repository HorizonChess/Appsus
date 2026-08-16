import { MAIL_FOLDERS } from '../services/mail.service.js'

// the service owns which folders exist, this owns only how they look
const FOLDER_DISPLAY = {
    inbox: { label: 'Inbox', icon: 'fa-inbox' },
    starred: { label: 'Starred', icon: 'fa-star' },
    sent: { label: 'Sent', icon: 'fa-paper-plane' },
    draft: { label: 'Drafts', icon: 'fa-file-lines' },
    trash: { label: 'Trash', icon: 'fa-trash' },
}

// gmail badges unread on inbox but total on drafts, and nothing anywhere else.
// the defaults cover the first render, before the counts have loaded
function getBadge(status, { total = 0, unread = 0 } = {}) {
    if (status === 'inbox') return unread
    if (status === 'draft') return total
    return 0
}

export function MailFolderList({ activeStatus, counts = {}, onSetStatus, onOpenCompose }) {
    return <nav className="mail-folder-list">

        <button className="mail-compose-btn" onClick={onOpenCompose}>
            <i className="fa-solid fa-pen"></i>
            <span>Compose</span>
        </button>

        <div className="mail-folders">
            {MAIL_FOLDERS.map(status => {
                const { label, icon } = FOLDER_DISPLAY[status]
                const badge = getBadge(status, counts[status])

                return <button
                    key={status}
                    className={`mail-folder ${status === activeStatus ? 'is-active' : ''}`}
                    onClick={() => onSetStatus(status)}>

                    <i className={`fa-solid ${icon}`}></i>
                    <span className="mail-folder-label">{label}</span>
                    {badge > 0 && <span className="mail-folder-count">{badge}</span>}

                </button>
            })}
        </div>

    </nav>
}
