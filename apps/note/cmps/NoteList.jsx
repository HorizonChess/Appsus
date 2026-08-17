import { NotePreview } from "./NotePreview.jsx"

const { useState } = React
export function NoteList({ notes, updateNote, onRemoveNote, onChangeStyle,onOpenModal,onChangeInfo }) {

    return <ul className="notes">
        {notes.map(note => {
            return <li key={note.id}>
                <article key={note.id} className="note" style={note.style} >
                    <NotePreview
                        note={note}
                        updateNote={updateNote}
                        onChangeInfo={onChangeInfo} />

                    <button
                        className="remove-note-btn"
                        onClick={() => onRemoveNote(note.id)}>X</button>

                    <div className='note-toolbar'>
                        {/* <button onClick={ev => onChangeStyle(ev,note)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button> */}
                        <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i className="fa-solid fa-pencil"></i></button>
                    </div>


                </article>

            </li>
        })}
    </ul>
}
