
import { noteService } from "../services/note.service.js"
import { eventBusService } from "../../../services/event-bus.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteAdd } from "../cmps/NoteAdd.jsx"
import { storageService } from "../../../services/async-storage.service.js"
import { NoteModal } from "../cmps/NoteModal.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
var index = 1
const { useState, useRef, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [editedNote, setEditedNote] = useState(noteService.getEmptyNote())

    console.log('editedNote',editedNote)
    useEffect(() => {
        noteService.query({})
            .then(notes => setNotes(notes))
    }, [])

    function onChangeType(type) {
        const emptyTodo = { txt: '', isDone: false }

        setEditedNote({ ...editedNote, type, info: type === 'NoteTodos' ? ({ title:'', todos: [emptyTodo] }) :( { title: '', txt: '' } )})

    }

    function onChangeInfo(newInfo, noteId) {
        if (!noteId) {
            updateNote({ ...editedNote, info: newInfo })
            console.log('hi')
            setEditedNote(prev => ({ ...prev, info: newInfo }))
        } else {
            const note = notes.find(note => note.id === noteId)
            console.log('note',note)
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
        eventBusService.emit('note-edit')
    }

    function onCloseModal() {
        console.log('Modal has closed...')
        setEditedNote(noteService.getEmptyNote())
        setIsShown(false)
    }

    return <section className="notes-container">
        <h1>Notes app</h1>

        <NoteComposer note={editedNote} onChangeInfo={onChangeInfo} onChangeType={onChangeType} addNote={addNote} />
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
            {editedNote && editedNote.id ? <NoteEdit note={editedNote} onChangeInfo={onChangeInfo} /> : <span></span>}
        </NoteModal>

    </section>
}
