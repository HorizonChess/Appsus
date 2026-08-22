
import { noteService } from "../services/note.service.js"
import { eventBusService } from "../../../services/event-bus.service.js"
import { utilService } from "../../../services/util.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteModal } from "../cmps/NoteModal.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"


import { useEffectUpdate } from '../custom-hooks/useEffectUpdate.js'

const { useState, useRef, useEffect } = React
const { useSearchParams, useNavigate } = ReactRouterDOM

export function NoteIndex() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))
    const [notes, setNotes] = useState([])

    const [isShown, setIsShown] = useState(false)
    const [editedNote, setEditedNote] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    useEffectUpdate(() => {
        // setSearchParams(filterBy)
        setSearchParams(utilService.trimObj(filterBy))
        loadNotes()
    }, [filterBy])

    function loadNotes() {
        noteService.query({ txt: '', type: filterBy.type }).
            then(notes => setfilteredNotes(notes, filterBy))
    }

    function setfilteredNotes(notes, filterBy) {
        var filteredNotes = [...notes]

        if (filterBy.type) {
            filteredNotes = filteredNotes.filter(note => note.type === filterBy.type)
        }

        if (filterBy.txt) {
            filteredNotes = filterNotesByText(filteredNotes, filterBy.txt)

        }

        if (filterBy.isPinned) {
            filteredNotes = filteredNotes.filter(note => note.isPinned)
        }

        setNotes(filteredNotes)
    }

    function filterNotesByText(notes, text) {
        const regExp = new RegExp(text, 'i')

        return notes.filter(note => {
            const { info } = note

            if (!info) return false
            if (text === '') return true
            const { title, txt, todos } = note.info
            if (title && regExp.test(title)) return true
            if (txt && regExp.test(txt)) return true
            if (todos && todos.some(todo => regExp.test(todo.txt))) return true

            return false
        })
    }


    function onChangeType(type, ev) {
        var note
        if (!editedNote) note = noteService.getEmptyNote()
        else note = editedNote

        const emptyTodo = { txt: '', isDone: false }

        if ((type) === 'NoteImg') {

            const reader = new FileReader()

            reader.readAsDataURL(ev.target.files[0])

            reader.onload = function (event) {
                const img = new Image()

                img.onload = () => {
                    const newInfo = { ...note.info, url: img.src }
                    note.info = newInfo
                    note.type = 'NoteImg'
                    setEditedNote(note)
                }
                img.src = event.target.result
            }

        } else {
            setEditedNote({
                ...note,
                type,
                info: type === 'NoteTodos' ? ({ title: '', todos: [emptyTodo] }) : ({ title: '', txt: '' })
            })
        }
    }

    function onTogglePinNote(noteId) {
        if (noteId || editedNote.id) {
            const searchNoteId = noteId ? noteId : editedNote.id

            const noteIdx = notes.findIndex(note => note.id === searchNoteId)
            console.log('noteIdx', noteIdx)
            const note = notes.at(noteIdx)

            note.isPinned = !note.isPinned
            noteService.save(note)

            // notes.splice(noteIdx, 1, note)

            notes.splice(noteIdx, 1)
            notes.unshift(note)
            setfilteredNotes([...notes], filterBy)
        }

        if (!noteId) {
            setEditedNote(prev => ({ ...prev, isPinned: !prev.isPinned }))
        }
    }

    function onChangeInfo(newInfo, noteId) {
        if (noteId || editedNote.id) {
            const searchNoteId = noteId ? noteId : editedNote.id

            const noteIdx = notes.findIndex(note => note.id === searchNoteId)
            const note = notes.at(noteIdx)

            note.info = newInfo
            noteService.save(note)

            notes.splice(noteIdx, 1, note)
            setfilteredNotes([...notes], filterBy)
        }

        if (!noteId) {
            setEditedNote(prev => ({ ...prev, info: newInfo }))
        }
    }

    function updateNote(updatednote) {
        const updatedNotes = [...notes]

        if (updatednote.id) {
            const updatedNoteIsx = notes.findIndex(note => note.id === updatednote.id)
            updatedNotes.splice(updatedNoteIsx, 1, updatednote)
            noteService.save(updatednote)
        }

        filterNotesByText(updatedNotes, filterBy)
    }

    function onloadEmptyNote() {
        setEditedNote(noteService.getEmptyNote())
    }


    function addNote() {
        const noteIdx = notes.length
        noteService.save(editedNote)
            .then(note => {

                notes.splice(noteIdx, 1, note)
                setfilteredNotes([...notes], filterBy)
            })

        notes.push(editedNote)

        setfilteredNotes([...notes], filterBy)
        setEditedNote(null)
    }

    function onChangeStyle(ev, noteId) {
        const { target } = ev
        var newStyle

        if (noteId || editedNote.id) {
            const searchNoteId = noteId ? noteId : editedNote.id
            const noteIdx = notes.findIndex(note => note.id === searchNoteId)
            const note = notes.at(noteIdx)

            const { style } = note
            newStyle = { ...style, backgroundColor: target.value }
            note.style = newStyle

            noteService.save(note)

            // notes.splice(noteIdx, 1, note)

            setfilteredNotes([...notes], filterBy)
        }

        if (!noteId) {
            setEditedNote(prev => ({ ...prev, style: newStyle }))
        }
        // if (editedNote.id) setEditedNote(updatedNote)
        // updateNote(updatedNote)
    }

    function removeNote(noteId) {
        noteService.remove(noteId)
        const updatedNotes = [...notes]
        const removedNoteIsx = notes.findIndex(note => note.id === noteId)
        updatedNotes.splice(removedNoteIsx, 1)
        setfilteredNotes(updatedNotes, filterBy)
    }



    function onOpenModal(noteId) {
        setEditedNote(notes.find(note => note.id === noteId))
        eventBusService.emit('note-edit')
        noteService.get(noteId)
        setIsShown(true)

    }

    function onCloseModal() {
        setEditedNote(null)
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
                newNotes.splice(duplicatedNoteIdx, 1, note)
                setNotes(newNotes)
            })

    }

    if (!notes) return <section className="notes-container note-layout">
        <div className="loader"></div>
    </section>

    function onCancelNoteEdit(ev) {
        setEditedNote(null)
    }

    function onEmitClick(ev) {
        eventBusService.emit('click', ev)
    }

    return <section className="notes-container note-layout" onClick={onEmitClick}>

        <NoteFilter
            filterBy={filterBy}
            onSetFilterBy={setFilterBy}
            onClearFilter={''} />


        <NoteComposer
            note={editedNote}
            onChangeInfo={onChangeInfo}
            onChangeType={onChangeType}
            onloadEmptyNote={onloadEmptyNote}
            addNote={addNote}
            onTogglePinEmptyNote={onTogglePinNote}
        onCancelNoteEdit={onCancelNoteEdit} />

        <NoteList
            notes={notes}
            onTogglePinNote={onTogglePinNote}
            editedNote={editedNote}
            onRemoveNote={removeNote}
            onChangeStyle={onChangeStyle}
            onOpenModal={onOpenModal}
            onChangeInfo={onChangeInfo}
            onDuplicateNote={onDuplicateNote}
        />


        <NoteModal
            isShown={isShown}
            onClose={onCloseModal}
            style={editedNote && editedNote.style}
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
