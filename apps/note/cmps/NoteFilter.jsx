const { Link, NavLink } = ReactRouterDOM
const { useSearchParams, useNavigate } = ReactRouterDOM

const { useState, useEffect } = React


export function NoteFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        const { value, name, type } = ev.target
        setFilterByToEdit(prev => ({ ...prev, [name]: value }))
    }


    return <aside className="note-sidebar">
        <nav className="note-tabs">
            <button className="note-tab-btn" name='type' value='' onClick={ev => handleChange(ev)}>Notes</button>
            <button className="note-tab-btn" name='type' value='NoteTxt' onClick={ev => handleChange(ev)}>Text Notes</button>
            <button className="note-tab-btn" name='type' value='NoteTodos' onClick={ev => handleChange(ev)}>Todo Notes</button>
            <button className="note-tab-btn" name='type' value='NoteVideo' onClick={ev => handleChange(ev)}>Video Notes</button>
            <button className="note-tab-btn" name='type' value='NoteAudio' onClick={ev => handleChange(ev)}>Audio Notes</button>
        </nav> 
    </aside>
}