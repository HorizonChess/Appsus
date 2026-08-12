
import { noteService } from "../services/note.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { storageService } from "../../../services/async-storage.service.js"

const { useState, useRef, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        noteService.query({})
            .then(notes => setNotes(notes))
    }, [])

    function updateNote(note) {
        console.log('updateNote--<note',note)

        noteService.save(note)
            .then(updatedNote => {
                const updatedNotes = [...notes]
                const updatedNoteIsx = notes.findIndex(note => note.id === updatedNote.id)
                updatedNotes.splice(updatedNoteIsx, 1, updatedNote)
                console.log('updatedNotes', updatedNotes)
                // setNotes(updatedNotes)
            })
    }

    if (!notes || !notes.length) return <section className="container">
        <div className="loader"></div>

    </section>

    return <section className="container">
        <h1>Notes app</h1>
        <NoteList
            notes={notes}
            updateNote={updateNote} />
    </section>
}
