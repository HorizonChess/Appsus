
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
    const [notes, setNotes] = useState(null)

    const [editedNote, setEditedNote] = useState(null)

    const openNoteId = searchParams.get('noteId')
    const openNote = notes ? notes.find(note => note.id === openNoteId) : null

    var visibleNotes
    // the addNote branch only runs for a mail handed over from MrEmail:
    // the saving to the user. every other visit just loads the list
    useEffect(() => {
        loadNotes()
    }, [])

    useEffectUpdate(() => {
        setSearchParams(utilService.trimObj(filterBy))
        loadNotes()
    }, [filterBy])

    useEffectUpdate(() => {
        setNotes(null)
    }, [filterBy.type])

    function loadNotes() {
        noteService.query({ txt: filterBy.txt, type: filterBy.type }).
            then(notes => {

                visibleNotes = noteService.getFilteredNotes(notes, filterBy)
                setNotes([...visibleNotes])
            })
    }

    function onUpdateNote(noteToUpdate, func, newInfo) {
        // const note = noteToUpdate ? notes.find(note => note.id === noteToUpdate.id) : openNote

        func(noteToUpdate, newInfo)

        noteService.save(noteToUpdate)
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
            notes={notes}
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
            isShown={openNote}
            onClose={onCloseModal}
            style={openNoteId && openNoteId.style}
        >
            {openNote ?

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
