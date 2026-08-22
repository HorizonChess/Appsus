import { mailService } from '../services/mail.service.js'
import { useLabels } from '../custom-hooks/useLabels.js'
import { MailLabelDialog } from './MailLabelDialog.jsx'

const { useState } = React

// the Move to dropdown. a brand new label is created by being put on the
// selection, which is the only way one can come into existence
export function MailLabelMenu({ mailIds, onClose }) {
    const labels = useLabels()
    const [txt, setTxt] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const labelsToShow = labels.filter(label => label.toLowerCase().includes(txt.toLowerCase()))

    function onPickLabel(label) {
        mailService.addLabel(mailIds, label)
            .then(onClose)
            .catch(err => console.log('Had issues labeling mails', err))
    }

    return <div className="mail-menu mail-label-menu">

        <h3 className="mail-label-menu-title">Move to:</h3>

        <div className="mail-label-search">
            <input
                type="text"
                className="mail-label-search-input"
                value={txt}
                autoFocus
                onChange={ev => setTxt(ev.target.value)} />

            <span className="material-symbols-outlined">search</span>
        </div>

        <ul className="mail-label-options">
            {labelsToShow.map(label => <li key={label}>
                <button className="mail-menu-option mail-label-option" onClick={() => onPickLabel(label)}>
                    {label}
                </button>
            </li>)}
        </ul>

        <div className="mail-label-menu-actions">
            <button className="mail-menu-option mail-label-action" onClick={() => setIsCreating(true)}>
                Create new
            </button>
        </div>

        {isCreating && <MailLabelDialog
            labels={labels}
            onCreate={onPickLabel}
            onClose={() => setIsCreating(false)} />}

    </div>
}
