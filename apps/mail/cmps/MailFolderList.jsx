import { MAIL_FOLDERS } from '../services/mail.service.js'

// the service owns which folders exist, this owns only how they look
// icon names are material symbols ligatures - the same set gmail draws from
const FOLDER_DISPLAY = {
    inbox: { label: 'Inbox', icon: 'inbox' },
    starred: { label: 'Starred', icon: 'star' },
    sent: { label: 'Sent', icon: 'send' },
    draft: { label: 'Drafts', icon: 'draft' },
    trash: { label: 'Trash', icon: 'delete' },
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
            <span className="material-symbols-outlined">edit</span>
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

                    <span className="material-symbols-outlined">{icon}</span>
                    <span className="mail-folder-label">{label}</span>
                    {badge > 0 && <span className="mail-folder-count">{badge}</span>}

                </button>
            })}
        </div>

    </nav>
}
