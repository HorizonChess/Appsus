
import { noteService } from "../services/note.service.js"
import { eventBusService } from "../../../services/event-bus.service.js"
import { utilService } from "../../../services/util.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteModal } from "../cmps/NoteModal.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"

import { useEffectUpdate } from '../custom-hooks/useEffectUpdate.js'
import { NoteFuncContext } from  '../custom-hooks/note-func.context.js'

const { useState, useRef, useEffect, createContext } = React
const { useSearchParams, useNavigate } = ReactRouterDOM

export function NoteIndex() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))
    const [notes, setNotes] = useState(null)
    const [editedNote, setEditedNote] = useState(null)

    const openNoteId = searchParams.get('noteId')
    const openNote = notes ? notes.find(note => {
        return openNoteId && note.id === openNoteId
    }) : null


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

    function onUpdateNote(noteToUpdate, changes) {
        const note = noteToUpdate ? notes.find(note => note.id === noteToUpdate.id) : openNote

        const prevNotes = notes
        const updatedNote = { ...note, ...changes }

        setNotes(notes.map(note => note.id === noteToUpdate.id ? updatedNote : note))

        noteService.save(updatedNote)
            .catch(err => {
                console.log('Had issues saving note', err)
                setNotes(prevNotes)
                showErrorMsg('Could not save note')
            })
    }

    function onTogglePinNote(note) {
        return { ...note, isPinned: !note.isPinned }
    }

    function onChangeInfo(note, newInfo) {
        return { ...note, info: newInfo }
        note.info = newInfo
    }

    function onChangeStyle(note, backgroundColor) {
        const newStyle = { ...note.style, backgroundColor }

        return { ...note, style: newStyle }
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

        // setNotes(notes.map(n => n.id === noteToUpdate.id ? newNote : n))

        noteService.save(duplicatedNote)
            .then(note => {
                const newNotes = [...notes]
                newNotes.splice(duplicatedNoteIdx, 1, note)
                setNotes(newNotes)
            })

    }

    return <section className="notes-container note-layout" onClick={ev => eventBusService.emit('click', ev)}>
        <NoteFuncContext.Provider value={ onUpdateNote }>

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
                onRemoveNote={removeNote}
                onChangeStyle={onChangeStyle}
                onOpenModal={onOpenModal}
                onDuplicateNote={onDuplicateNote}
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

        </NoteFuncContext.Provider>
    </section>
}
