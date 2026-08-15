import { NotePreview } from "./NotePreview.jsx"

const { useState } = React
export function NoteList({ notes, updateNote, onRemoveNote, onChangeStyle,onOpenModal }) {
    const [editedNoteId, setEditedNoteId] = useState(null)

    return <ul className="notes">
        {notes.map(note => {
            return <li key={note.id}>
                <article key={note.id} className="note" style={note.style} >
                    <NotePreview
                        note={note}
                        updateNote={updateNote} />

                    <button
                        className="remove-note-btn"
                        onClick={() => onRemoveNote(note.id)}><i className="fa-solid fa-trash-can"></i></button>

                    <div className='note-toolbar'>
                        {/* <button onClick={ev => onChangeStyle(ev,note)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button> */}
                        <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i class="fa-solid fa-pencil"></i></button>
                    </div>


                </article>

            </li>
        })}
        note list
    </ul>
}
