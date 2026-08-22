import { useKeyListener } from '../custom-hooks/useKeyListener.js'
import { MailLabelMenu } from './MailLabelMenu.jsx'

const { useState } = React

// the Move to button and the menu hanging off it. whether that menu is open is
// state nothing else in the toolbar reads, the same way the pager owns its own
export function MailMoveTo({ mailIds, onMoved }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useKeyListener('Escape', () => setIsMenuOpen(false))

    // the mails have moved, so the rows that were ticked are on their way out
    function onClose() {
        setIsMenuOpen(false)
        onMoved()
    }

    return <div className="mail-move">

        <button
            className="mail-icon-btn"
            title="Move to"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="material-symbols-outlined">drive_file_move</span>
        </button>

        {/* catches the outside click that closes the menu */}
        {isMenuOpen && <div
            className="mail-menu-backdrop"
            onClick={() => setIsMenuOpen(false)}></div>}

        {isMenuOpen && <MailLabelMenu mailIds={mailIds} onClose={onClose} />}

    </div>
}
