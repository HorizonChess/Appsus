import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes }) {

    return <div>
        {notes.map(note => {
            return <article key={note.id}>
                <NotePreview
                    note={note} />
            </article>

        })}
        note list
    </div>
}
