import { NotePreview } from "./NotePreview.jsx"
import { NoteModal } from "./NoteModal.jsx"

const { useState } = React
export function NoteList({ notes, updateNote, onRemoveNote, onChangeStyle }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedNoteId, setEditedNoteId] = useState(null)


    function onOpenModal(noteId) {
        setEditedNoteId(noteId)
        setIsModalOpen(true)
    }

    function onCloseModal() {
        setIsModalOpen(false)
    }

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
                        <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
                    </div>

                    <NoteModal
                        isOpen={isModalOpen}
                        editedNoteId={editedNoteId}
                        onCloseModal={onCloseModal}
                        note={note}
                        onChangeStyle={onChangeStyle}
                    />
                </article>

            </li>
        })}
        note list
    </ul>
}
