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

function getBadge(folder, { total = 0, unread = 0 } = {}) {
    if (folder === 'inbox') return unread
    if (folder === 'draft') return total
    return 0
}

export function MailFolderList() {
    const [counts, setCounts] = useState({})
    const [searchParams, setParams] = useMailParams()
    const navigate = useNavigate()

    const activeFolder = searchParams.get('folder') || 'inbox'
    const isRail = searchParams.get('nav') === 'rail'

    useEffect(() => {
        loadCounts()
        return eventBusService.on('mails-changed', loadCounts)
    }, [])

    function loadCounts() {
        mailService.getFolderCounts()
            .then(setCounts)
            .catch(err => console.log('Had issues loading folder counts', err))
    }

    // mailId is a route segment, so only a path change leaves an open mail
    function onSetFolder(folder) {
        navigate(`/mail?folder=${folder}`)
    }

    function onOpenCompose() {
        setParams({ compose: 'new' })
    }

    return <nav className={`mail-folder-list ${isRail ? 'is-rail' : ''}`}>

        <button className="mail-compose-btn" onClick={onOpenCompose}>
            <span className="material-symbols-outlined">edit</span>
            <span>Compose</span>
        </button>

        <div className="mail-folders">
            {MAIL_FOLDERS.map(folder => {
                const { label, icon } = FOLDER_DISPLAY[folder]
                const badge = getBadge(folder, counts[folder])

                return <button
                    key={folder}
                    className={`mail-folder ${folder === activeFolder ? 'is-active' : ''}`}
                    onClick={() => onSetFolder(folder)}>

                    <span className="material-symbols-outlined">{icon}</span>
                    <span className="mail-folder-label">{label}</span>
                    {badge > 0 && <span className="mail-folder-count">{badge}</span>}

                </button>
            })}
        </div>

    </nav>
}
