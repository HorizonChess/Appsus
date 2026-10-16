import { MAIL_FOLDERS, mailService } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'
import { useIsPhone } from '../custom-hooks/useIsPhone.js'
import { useKeyListener } from '../custom-hooks/useKeyListener.js'
import { MailLabels } from './MailLabels.jsx'

const { useState, useEffect, Fragment } = React
const { useNavigate, useParams } = ReactRouterDOM

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

    const { folder: activeFolder } = useMailFilter()
    const { mailId } = useParams()
    const isPhone = useIsPhone()

    // one url flag, two meanings: a desktop nav starts open and can fold down to a
    // rail, a phone nav is a drawer that starts shut and can be slid open
    const nav = searchParams.get('nav')
    const isRail = !isPhone && nav === 'rail'
    const isDrawerOpen = isPhone && nav === 'open'

    useKeyListener('Escape', () => { if (isDrawerOpen) onCloseDrawer() })

    // both signals, because the numbers move whether or not the list already
    // knows - see _notifyCounts in the service
    useEffect(() => {
        loadCounts()

        const unsubs = [
            eventBusService.on('mails-changed', loadCounts),
            eventBusService.on('mail-counts-changed', loadCounts),
        ]

        return () => unsubs.forEach(unsub => unsub())
    }, [])

    function loadCounts() {
        mailService.getFolderCounts()
            .then(setCounts)
            .catch(err => console.log('Had issues loading folder counts', err))
    }

    // mailId is a route segment, so only a path change leaves an open mail.
    // labels come through here too, and those can hold spaces and slashes
    function onSetFolder(folder) {
        navigate(`/mail?folder=${encodeURIComponent(folder)}`)
    }

    // a phone's drawer has done its job once compose is up, so it goes with it
    function onOpenCompose() {
        setParams(isPhone ? { compose: 'new', nav: '' } : { compose: 'new' })
    }

    function onCloseDrawer() {
        setParams({ nav: '' })
    }

    return <Fragment>

        <nav className={`mail-folder-list ${isRail ? 'is-rail' : ''} ${isDrawerOpen ? 'is-open' : ''}`}>

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

            <MailLabels
                counts={counts}
                activeFolder={activeFolder}
                onSetFolder={onSetFolder} />

        </nav>

        {isDrawerOpen && <div className="mail-nav-scrim" onClick={onCloseDrawer}></div>}

        {/* only a phone shows this - the drawer hides the real button, and an open
            mail has its own reply. css keeps it hidden everywhere else */}
        {!mailId && <button className="mail-compose-btn mail-fab" onClick={onOpenCompose}>
            <span className="material-symbols-outlined">edit</span>
            <span>Compose</span>
        </button>}

    </Fragment>
}
