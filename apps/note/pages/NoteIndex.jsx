
import { noteService } from "../services/note.service.js"
import { eventBusService } from "../../../services/event-bus.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteModal } from "../cmps/NoteModal.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"

const { useState, useRef, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [editedNote, setEditedNote] = useState(noteService.getEmptyNote())

    useEffect(() => {
        noteService.query({})
            .then(notes => setNotes(notes))
    }, [])

    function onChangeType(type) {
        const emptyTodo = { txt: '', isDone: false }

        setEditedNote({
...editedNote,
type,
info: type === 'NoteTodos' ? ({ title: '', todos: [emptyTodo] }) : ({ title: '', txt: '' })
        })

    }

    function onTogglePinEmptyNote() {
        const updatedNote = { ...editedNote, isPinned: !editedNote.isPinned }
        setEditedNote(updatedNote)
        updateNote(updatedNote)

    }

    function onTogglePinNote(note) {
        const updatedNote = { ...note, isPinned: !note.isPinned }
        const updatedNoteIdx = notes.findIndex(note => note.id === updatedNote.id)
        notes.splice(updatedNoteIdx, 1)
        notes.unshift(updatedNote)

        if (editedNote.id) setEditedNote(updatedNote)
        updateNote(updatedNote)
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
        notes.push(editedNote)
        setEditedNote(noteService.getEmptyNote())

        const noteIdx = notes.length - 1

        setNotes([...notes])

        noteService.save(editedNote)
            .then(note => {
                const newNotes = [...notes]
                newNotes.splice(noteIdx, 1, note)
                setNotes(newNotes)
            })


    }

    function onChangeStyle(ev, note) {
        const { target } = ev
        const { style } = note
        const newStyle = { ...style, backgroundColor: target.value }
        const updatedNote = { ...note, style: newStyle }

        if (editedNote.id) setEditedNote(updatedNote)
        updateNote(updatedNote)
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
        setEditedNote(notes.find(note => note.id === noteId))
        eventBusService.emit('note-edit')
        noteService.get(noteId)
        setIsShown(true)

    }

    function onCloseModal() {
        setEditedNote(noteService.getEmptyNote())
        setIsShown(false)
    }

    function onDuplicateNote(note) {
        const duplicatedNote = JSON.parse(JSON.stringify(note))
        const duplicatedNoteIdx = notes.findIndex(note => note.id === duplicatedNote.id)

        duplicatedNote.id = null
        notes.splice(duplicatedNoteIdx, 0, duplicatedNote)
        // const noteIdx = notes.length - 1

        setNotes([...notes])

        noteService.save(duplicatedNote)
            .then(note => {
                const newNotes = [...notes]
                newNotes.splice(duplicatedNoteIdx+1, 1, note)
                setNotes(newNotes)
            })

    }

    return <section className="notes-container">
        <h1>Notes app</h1>

        <NoteComposer
            note={editedNote}
            onChangeInfo={onChangeInfo}
            onChangeType={onChangeType}
            addNote={addNote}
            onTogglePinEmptyNote={onTogglePinEmptyNote} />

        <NoteList
            notes={notes}
            onTogglePinNote={onTogglePinNote}
            editedNote={editedNote}
            updateNote={updateNote}
            onRemoveNote={removeNote}
            onChangeStyle={onChangeStyle}
            onOpenModal={onOpenModal}
            onChangeInfo={onChangeInfo}
            onDuplicateNote={onDuplicateNote}
        />

        <NoteModal
            isShown={isShown}
            onClose={onCloseModal}
            style={editedNote.style}
        >
            {editedNote && editedNote.id ?

                <NoteEdit
                    note={{ ...editedNote }}
                    onChangeInfo={onChangeInfo}
                    onChangeStyle={onChangeStyle}
                    onTogglePinNote={onTogglePinNote} />
                :
                <span></span>}
        </NoteModal>

    </section>
}
