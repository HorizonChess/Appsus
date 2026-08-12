import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes, updateNote,onRemoveNote }) {

    return <ul className="notes">
        {notes.map(note => {
            return <li key={note.id}>
                <NotePreview
                    note={note}
                    updateNote={updateNote} />
                
                <button 
                className="remove-note-btn"
                onClick={()=>onRemoveNote(note.id)}>Delete</button>

            </li>



        })}
        note list
    </ul>
}
