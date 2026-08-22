
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

    const [editedNote, setEditedNote] = useState(null)

    const openNoteId = searchParams.get('noteId')
    const openNote = notes.find(note => note.id === openNoteId)
    const visibleNotes = noteService.getFilteredNotes(notes, filterBy)

    // the addNote branch only runs for a mail handed over from MrEmail:
    // the saving to the user. every other visit just loads the list
    useEffect(() => {
        loadNotes()
    }, [])

    useEffectUpdate(() => {
        setSearchParams(utilService.trimObj(filterBy))
        loadNotes()
    }, [filterBy])

    function loadNotes() {
        noteService.query({ txt: '', type: filterBy.type }).
            then(notes => setNotes([...notes]))
    }

    function onUpdateNote(noteId, func, newInfo) {
        const note = noteId ? notes.find(note => note.id === noteId) : openNote

        func(note, newInfo)

        noteService.save(note)
        setNotes([...notes])
    }

    function onTogglePinNote(note) {
        note.isPinned = !note.isPinned
    }

    function onChangeInfo(note, newInfo) {
        note.info = newInfo
    }

    function onChangeStyle(note, backgroundColor) {
        const newStyle = { ...note.style, backgroundColor }
        note.style = newStyle
    }

    function addNote(draftNote) {
        const noteIdx = notes.length
        noteService.save(draftNote)
            .then(note => {
                notes.splice(noteIdx, 1, note)
                setNotes([...notes])
            })

        notes.push(draftNote)

        setNotes([...notes])
        setEditedNote(null)
    }

    function removeNote(noteId) {
        noteService.remove(noteId)
        const updatedNotes = [...notes]
        const removedNoteIsx = notes.findIndex(note => note.id === noteId)
        updatedNotes.splice(removedNoteIsx, 1)
        setNotes(updatedNotes)
    }

    function onOpenModal(noteId) {
        setFilterBy({ ...filterBy, noteId })
    }

    function onCloseModal() {
        setFilterBy({ ...filterBy, noteId: '' })

    }

    function onDuplicateNote(note) {
        const duplicatedNote = JSON.parse(JSON.stringify(note))
        const duplicatedNoteIdx = notes.findIndex(note => note.id === duplicatedNote.id)

        duplicatedNote.id = null
        notes.splice(duplicatedNoteIdx, 0, duplicatedNote)

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


    return <section className="notes-container note-layout" onClick={ev => eventBusService.emit('click', ev)}>

        <NoteFilter
            filterBy={filterBy}
            onSetFilterBy={setFilterBy}
            onClearFilter={''} />


        <NoteComposer
            note={noteService.getEmptyNote()}
            addNote={addNote}
        />

        <NoteList
            notes={visibleNotes}
            onTogglePinNote={onTogglePinNote}
            editedNote={editedNote}
            onRemoveNote={removeNote}
            onChangeStyle={onChangeStyle}
            onOpenModal={onOpenModal}
            onChangeInfo={onChangeInfo}
            onDuplicateNote={onDuplicateNote}
            onUpdateNote={onUpdateNote}
        />


        <NoteModal
            isShown={openNoteId}
            onClose={onCloseModal}
            style={editedNote && editedNote.style}
        >
            {openNoteId ?

                <NoteEdit
                    note={openNote}
                    onUpdateNote={onUpdateNote}
                    onChangeInfo={onChangeInfo}
                    onChangeStyle={onChangeStyle}
                    onTogglePinNote={onTogglePinNote} />
                :
                <span></span>}
        </NoteModal>


    </section>
}
