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
            <button className={`note-tab-btn ${!filterByToEdit.type ? 'active' : ''}`} name='type' value='' onClick={ev => handleChange('')}>
                <i class="fa-regular fa-lightbulb"></i></button>
            <button className={`note-tab-btn ${filterByToEdit.type === 'NoteTxt' ? 'active' : ''}`} name='type' value='NoteTxt' onClick={ev => handleChange('NoteTxt')}>
                <i class="fa-solid fa-pencil"></i></button>
            <button className={`note-tab-btn ${filterByToEdit.type === 'NoteTodos' ? 'active' : ''}`} name='type' value='NoteTodos' onClick={ev => handleChange('NoteTodos')}>
                <i class="fa-regular fa-square-check"></i></button>
            <button className={`note-tab-btn ${filterByToEdit.type === 'NoteVideo' ? 'active' : ''}`} name='type' value='NoteVideo' onClick={ev => handleChange('NoteVideo')}>
                <i class="fa-brands fa-youtube"></i></button>
            <button className={`note-tab-btn ${filterByToEdit.type === 'NoteAudio' ? 'active' : ''}`} name='type' value='NoteAudio' onClick={ev => handleChange('NoteAudio')}><i class="fa-solid fa-volume"></i></button>
        </nav>
    </aside>
}