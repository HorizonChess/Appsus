import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes,updateNote }) {

    return <ul className="notes">
        {notes.map(note => {
            return <li key={note.id}>
                <NotePreview
                    note={note}
                    updateNote={updateNote} />
            </li>


        })}
        note list
    </ul>
}
