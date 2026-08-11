
import { noteService } from "../services/note.service.js"

import { NoteList } from "../cmps/NoteList.jsx"

const { useState, useRef, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        noteService.query({})
            .then(notes => setNotes(notes))
    }, [])

    if (!notes || !notes.length) return <section className="container">
        <div className="loader"></div>

    </section>

    return <section className="container">
        <h1>Notes app</h1>
        <NoteList 
            notes={notes}/>
    </section>
}
