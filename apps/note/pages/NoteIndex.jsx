
import { noteService } from "../services/note.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteAdd } from "../cmps/NoteAdd.jsx"
import { storageService } from "../../../services/async-storage.service.js"

const { useState, useRef, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        noteService.query({})
            .then(notes => setNotes(notes))
    }, [])

    function updateNote(updatednote) {
        noteService.save(updatednote)
            .then(updatedNote => {
                const updatedNotes = [...notes]
                const updatedNoteIsx = notes.findIndex(note => note.id === updatedNote.id)
                updatedNotes.splice(updatedNoteIsx, 1, updatedNote)
                setNotes(updatedNotes)
            })
    }

    function addNote(emptyNote) {
        const newNotes= [...notes]
        newNotes.push(emptyNote)
        setNotes(newNotes)
        noteService.save(emptyNote)
    }

    function onChangeStyle(ev, note) {
        const { target } = ev
        const { style } = note
        const newStyle = { ...style, backgroundColor: target.value }
        const updatedNote = { ...note, style: newStyle }

        updateNote(updatedNote)
        const updatedNotes = [...notes]
        const updatedNoteIsx = notes.findIndex(note => note.id === updatedNote.id)
        updatedNotes.splice(updatedNoteIsx, 1, updatedNote)
        setNotes(updatedNotes)
    }

    function removeNote(noteId) {
        noteService.remove(noteId)
        const updatedNotes = [...notes]
        const removedNoteIsx = notes.findIndex(note => note.id === noteId)
        updatedNotes.splice(removedNoteIsx, 1)
        setNotes(updatedNotes)
    }

    if (!notes || !notes.length) return <section className="container">
        <div className="loader"></div>

    </section>

    return <section className="container">
        <h1>Notes app</h1>
        <NoteAdd
            emptyNote={noteService.getEmptyNote()}
            addNote={addNote}

        />
        <NoteList
            notes={notes}
            updateNote={updateNote}
            onRemoveNote={removeNote}
            onChangeStyle={onChangeStyle} />
    </section>
}
