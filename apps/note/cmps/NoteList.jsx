import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes }) {

    return <div className="notes">
        {notes.map(note => {
            return <article key={note.id} className="note" style={note.style}>
                <NotePreview
                    note={note} />
            </article>

        })}
        note list
    </div>
}
