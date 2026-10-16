import { MAIL_FOLDERS, mailService } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'
import { useIsPhone } from '../custom-hooks/useIsPhone.js'
import { useKeyListener } from '../custom-hooks/useKeyListener.js'
import { MailLabels } from './MailLabels.jsx'
import { MailLogo } from './MailLogo.jsx'
import { MailComposeBtn } from './MailComposeBtn.jsx'

const { useState, useEffect, Fragment } = React
const { useNavigate } = ReactRouterDOM

// icon names are material symbols ligatures - the same set gmail draws from.
// the list's title on a phone reads the label off here too
export const FOLDER_DISPLAY = {
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

    function onCloseDrawer() {
        setParams({ nav: '' })
    }

    return <Fragment>

        <nav className={`mail-folder-list ${isRail ? 'is-rail' : ''} ${isDrawerOpen ? 'is-open' : ''}`}>

            {/* gmail's phone drawer opens on the app's name, not a compose button -
                that one floats over the list instead */}
            {isPhone
                ? <div className="mail-drawer-brand"><MailLogo /></div>
                : <MailComposeBtn />}

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

    </Fragment>
}
