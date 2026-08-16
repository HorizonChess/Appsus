
import { noteService } from "../services/note.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteAdd } from "../cmps/NoteAdd.jsx"
import { storageService } from "../../../services/async-storage.service.js"
import { NoteModal } from "../cmps/NoteModal.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"

const { useState, useRef, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [editedNote, setEditedNote] = useState(null)
    const [emptyNote, setEmptyNote] = useState(noteService.getEmptyNote())

    useEffect(() => {
        noteService.query({})
            .then(notes => setNotes(notes))
    }, [])


    function onChangeInputType(type) {
        setEmptyNote({ ...emptyNote, type })

    }

    function onChangeInfo(newInfo, noteId) {
        if (!noteId) {
            updateNote({ ...editedNote, info: newInfo })
            setEditedNote(prev => ({ ...prev, info: newInfo }))
        } else {
            const note = notes.find(note => note.id === noteId)
            updateNote({ ...note, info: newInfo })

        }
    }

    function updateNote(updatednote) {
        const updatedNotes = [...notes]

        if (updatednote.id) {
            const updatedNoteIsx = notes.findIndex(note => note.id === updatednote.id)
            updatedNotes.splice(updatedNoteIsx, 1, updatednote)
            noteService.save(updatednote)
        }

        setNotes(updatedNotes)

    }

    function addNote() {
        const newNotes = [...notes]
        newNotes.push(emptyNote)
        const noteIdx = newNotes.length - 1
        noteService.save(emptyNote)
            .then(savedNote => {
                const updatedNotes = [...notes]
                updatedNotes.splice(noteIdx, 1, savedNote)
                setNotes(updatedNotes)
            })
        setNotes([...newNotes])
        setEditedNote(noteService.getEmptyNote())
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


    function onOpenModal(noteId) {
        noteService.get(noteId)
        setEditedNote(notes.find(note => note.id === noteId))
        console.log('Modal has opened...')
        setIsShown(true)
    }

    function onCloseModal() {
        console.log('Modal has closed...')
        setEditedNote(null)
        setIsShown(false)
    }

    return <section className="notes-container">
        <h1>Notes app</h1>
        <NoteAdd
            addNote={addNote}
            emptyNote={emptyNote}
            onChangeInputType={onChangeInputType}

        >
            <NoteEdit note={emptyNote} onChangeInfo={onChangeInfo} />
        </NoteAdd>
        <NoteList
            notes={notes}
            updateNote={updateNote}
            onRemoveNote={removeNote}
            onChangeStyle={onChangeStyle}
            onOpenModal={onOpenModal}
            onChangeInfo={onChangeInfo} />

        <NoteModal
            isShown={isShown}
            onClose={onCloseModal}
            editedNote={editedNote}
        >
            {editedNote ? <NoteEdit note={editedNote} onChangeInfo={onChangeInfo} /> : <span></span>}
        </NoteModal>

    </section>
}
