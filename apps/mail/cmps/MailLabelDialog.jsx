const { useState } = React

// gmail's New label dialog. nesting is only ever a path, so picking a parent
// here just decides what gets put in front of the name
export function MailLabelDialog({ labels, onCreate, onClose }) {
    const [name, setName] = useState('')
    const [isNested, setIsNested] = useState(false)
    const [parent, setParent] = useState('')

    // a nested label cannot itself be a parent, gmail only goes one level deep
    const parents = labels.filter(label => !label.includes('/'))
    const isValid = Boolean(name.trim()) && (!isNested || parent)

    function onSubmit(ev) {
        ev.preventDefault()
        if (!isValid) return

        onCreate(isNested ? `${parent}/${name.trim()}` : name.trim())
    }

    return <div className="mail-dialog-backdrop" onClick={onClose}>

        <form
            className="mail-dialog"
            onSubmit={onSubmit}
            onClick={ev => ev.stopPropagation()}>

            <h2 className="mail-dialog-title">New label</h2>

            <label className="mail-dialog-prompt" htmlFor="mail-label-name">
                Please enter a new label name:
            </label>

            <input
                id="mail-label-name"
                type="text"
                className="mail-dialog-input"
                value={name}
                autoFocus
                onChange={ev => setName(ev.target.value)} />

            <label className="mail-dialog-nest">
                <input
                    type="checkbox"
                    checked={isNested}
                    onChange={ev => setIsNested(ev.target.checked)} />
                <span>Nest label under:</span>
            </label>

            <select
                className="mail-dialog-select"
                value={parent}
                disabled={!isNested}
                onChange={ev => setParent(ev.target.value)}>

                <option value=""></option>
                {parents.map(label => <option key={label} value={label}>{label}</option>)}
            </select>

            <footer className="mail-dialog-actions">
                <button type="button" className="mail-dialog-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="mail-dialog-create" disabled={!isValid}>Create</button>
            </footer>

        </form>
    </div>
}
