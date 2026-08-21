import { MAIL_FOLDERS, mailService } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

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

// takes no props - the sidebar shows on both the list and the open mail, and
// passing it down from each of them was the whole reason details had to nest
export function MailFolderList() {
    const [counts, setCounts] = useState({})
    const [searchParams, setParams] = useMailParams()
    const navigate = useNavigate()

    const activeStatus = searchParams.get('status') || 'inbox'

    useEffect(() => {
        loadCounts()
        return eventBusService.on('mails-changed', loadCounts)
    }, [])

    function loadCounts() {
        mailService.getFolderCounts()
            .then(setCounts)
            .catch(err => console.log('Had issues loading folder counts', err))
    }

    // not setParams: it drops every other param, and it has to leave /mail/:mailId
    function onSetStatus(status) {
        navigate(`/mail?status=${status}`)
    }

    function onOpenCompose() {
        setParams({ compose: 'new' })
    }

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
