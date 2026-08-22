import { useMenu } from '../custom-hooks/useMenu.js'
import { MailMenu } from './MailMenu.jsx'
import { MailLabelMenu } from './MailLabelMenu.jsx'

// the Move to button and the menu hanging off it. whether that menu is open is
// state nothing else in the toolbar reads, the same way the pager owns its own
export function MailMoveTo({ mailIds, onMoved }) {
    const { isOpen, toggle, close } = useMenu()

    // the mails have moved, so the rows that were ticked are on their way out
    function onMoveDone() {
        close()
        onMoved()
    }

    return <div className="mail-move">

        <button className="mail-icon-btn" title="Move to" onClick={toggle}>
            <span className="material-symbols-outlined">drive_file_move</span>
        </button>

        <MailMenu isOpen={isOpen} onClose={close}>
            <MailLabelMenu mailIds={mailIds} onClose={onMoveDone} />
        </MailMenu>

    </div>
}
