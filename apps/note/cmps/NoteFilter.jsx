const { Link, NavLink } = ReactRouterDOM
const { useParams, useSearchParams, useNavigate } = ReactRouterDOM

const { useState, useEffect } = React
const titleByType = {
    '': 'MissKeep',
    'NoteTxt': 'Text Notes',
    'NoteTodos': 'Todo Notes',
    'NoteVideo': 'Video Notes',
    'NoteAudio': 'Audio Notes',
    'NoteImg': 'Image Notes',
}

export function NoteFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [title, setTitle] = useState('MissKeep')

    const params = useParams()
    const type = params.type

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
        setTitle(titleByType[filterByToEdit.type])
    }, [filterByToEdit])

    function handleChange(value, name) {
        setFilterByToEdit(prev => ({ ...prev, [name]: value }))
    }


    function onToggleNav() {
        setIsMenuOpen(prev => !prev)
    }


    return <div class='note-header'>

        <div className="note-top-bar">
            <div className="note-brand">
                <button
                    type="button"
                    className="note-open-nav-btn"
                    title="Main menu"
                    onClick={onToggleNav}>
                    <span className="material-symbols-outlined">menu</span>
                </button>



                <img className="miskeep-logo" src="../../../assets/Google_Keep_2020_Logo.svg" alt="" />

                <h2>
                    {title}
                </h2>
            </div>

            <div className="note-search">

                <span className="material-symbols-outlined note-search-icon">search</span>

                <input
                    type="text"
                    value={filterByToEdit.txt}
                    placeholder="Search note"
                    className="note-search-input"
                    onChange={ev => handleChange(ev.target.value, 'txt')} />

                {filterBy && filterBy.txt && <button
                    type="button"
                    className="note-icon-btn clear-search-btn"
                    title="Clear search"
                    onClick={ev => handleChange('', 'txt')}>
                    <span className="material-symbols-outlined">close</span>
                </button>}

            </div>
        </div>


        <aside className={`note-sidebar ${isMenuOpen ? 'open' : ''}`}>

            <nav className="note-tabs">
                <div className="note-tab" onClick={ev => handleChange('', 'type')}>
                    <button className={`note-tab-btn ${!filterByToEdit.type ? 'active' : ''}`} name='type' value='' >
                        <i class="fa-regular fa-lightbulb"></i></button>
                    <h3 className="note-tab-txt">All Notes</h3>
                </div>

                <div className="note-tab" onClick={ev => handleChange('NoteTxt', 'type')}>
                    <button className={`note-tab-btn ${filterByToEdit.type === 'NoteTxt' ? 'active' : ''}`} name='type' value='NoteTxt' >
                        <i class="fa-solid fa-pencil"></i></button>
                    <h3 className="note-tab-txt">Text Notes</h3>
                </div>

                <div className="note-tab" onClick={ev => handleChange('NoteTodos', 'type')}>
                    <button className={`note-tab-btn ${filterByToEdit.type === 'NoteTodos' ? 'active' : ''}`} name='type' value='NoteTodos' >
                        <i class="fa-regular fa-square-check"></i></button>
                    <h3 className="note-tab-txt">Todo Notes</h3>
                </div>

                <div className="note-tab" onClick={ev => handleChange('NoteVideo', 'type')}>
                    <button className={`note-tab-btn ${filterByToEdit.type === 'NoteVideo' ? 'active' : ''}`} name='type' value='NoteVideo' >
                        <i class="fa-brands fa-youtube"></i></button>
                    <h3 className="note-tab-txt">Video Notes</h3>
                </div>

                <div className="note-tab" onClick={ev => handleChange('NoteAudio', 'type')}>
                    <button className={`note-tab-btn ${filterByToEdit.type === 'NoteAudio' ? 'active' : ''}`} name='type' value='NoteAudio' >
                        <i class="fa-solid fa-volume"></i></button>
                    <h3 className="note-tab-txt">Audio Notes</h3>
                </div>

            </nav>
        </aside>
    </div>

}