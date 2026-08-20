const { Link, NavLink } = ReactRouterDOM
const { useParams, useSearchParams, useNavigate } = ReactRouterDOM

const { useState, useEffect } = React


export function NoteFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    const params = useParams()
    const type = params.type

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(value) {
        setFilterByToEdit(prev => ({ ...prev, type: value }))
    }


    return <aside className="note-sidebar">
        <nav className="note-tabs">
            <div className="note-tab" onClick={ev => handleChange('')}>
                <button className={`note-tab-btn ${!filterByToEdit.type ? 'active' : ''}`} name='type' value='' >
                    <i class="fa-regular fa-lightbulb"></i></button>
                <h3 className="note-tab-txt">All Notes</h3>
            </div>

            <div className="note-tab" onClick={ev => handleChange('NoteTxt')}>
                <button className={`note-tab-btn ${filterByToEdit.type === 'NoteTxt' ? 'active' : ''}`} name='type' value='NoteTxt' >
                    <i class="fa-solid fa-pencil"></i></button>
                <h3 className="note-tab-txt">Text Notes</h3>
            </div>

            <div className="note-tab" onClick={ev => handleChange('NoteTodos')}>
                <button className={`note-tab-btn ${filterByToEdit.type === 'NoteTodos' ? 'active' : ''}`} name='type' value='NoteTodos' >
                    <i class="fa-regular fa-square-check"></i></button>
                <h3 className="note-tab-txt">Todo Notes</h3>
            </div>

            <div className="note-tab" onClick={ev => handleChange('NoteVideo')}>
                <button className={`note-tab-btn ${filterByToEdit.type === 'NoteVideo' ? 'active' : ''}`} name='type' value='NoteVideo' >
                    <i class="fa-brands fa-youtube"></i></button>
                <h3 className="note-tab-txt">Video Notes</h3>
            </div>

            <div className="note-tab" onClick={ev => handleChange('NoteAudio')}>
                <button className={`note-tab-btn ${filterByToEdit.type === 'NoteAudio' ? 'active' : ''}`} name='type' value='NoteAudio' >
                    <i class="fa-solid fa-volume"></i></button>
                <h3 className="note-tab-txt">Audio Notes</h3>
            </div>

        </nav>
    </aside>
}