import { mailService } from '../services/mail.service.js'
import { useLabels } from '../custom-hooks/useLabels.js'

// the labels half of the sidebar. a label is a folder as far as the url is
// concerned, so these rows are the same rows, pointed at a different value
export function MailLabels({ counts, activeFolder, onSetFolder }) {
    const labels = useLabels()

    if (!labels.length) return null

    return <div className="mail-labels">

        <h3 className="mail-labels-title">Labels</h3>

        {labels.map(label => {
            const { unread = 0 } = counts[label] || {}

            return <button
                key={label}
                className={`mail-folder mail-label ${label.includes('/') ? 'is-nested' : ''} ${label === activeFolder ? 'is-active' : ''}`}
                onClick={() => onSetFolder(label)}>

                <span className="material-symbols-outlined">label</span>
                <span className="mail-folder-label">{mailService.getLabelName(label)}</span>
                {unread > 0 && <span className="mail-folder-count">{unread}</span>}

            </button>
        })}

    </div>
}
