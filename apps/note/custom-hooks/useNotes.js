import { utilService } from "../../../services/util.service.js"
import { noteService } from "../services/note.service.js"
import {useEffectUpdate} from '/useEffectUpdate.js'
const { useState, useRef, useEffect } = React
const { useSearchParams, useNavigate } = ReactRouterDOM

export function useNotes() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))
    const [notes, setNotes] = useState(null)
    
    const openNoteId = searchParams.get('noteId')
    const openNote = notes ? notes.find(note => {
        return openNoteId && note.id === openNoteId
    }) : null

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

                setNotes(noteService.getFilteredNotes(notes, filterBy))
            })
    }


    function updateNote(noteToUpdate, changes) {
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

    function togglePinNote(note) {
        return { ...note, isPinned: !note.isPinned }
    }

    function changeInfo(note, newInfo) {
        return { ...note, info: newInfo }
        note.info = newInfo
    }

    function changeStyle(note, backgroundColor) {
        const newStyle = { ...note.style, backgroundColor }
        console.log('newStyle', newStyle)
        console.log('note', note)
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

    function duplicateNote(note) {
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

    return {
        notes,
        openNote,
        openNoteId,
        filterBy,
        setFilterBy,
        loadNotes,
        addNote,
        updateNote,
        removeNote,
        duplicateNote,
        togglePinNote,
        changeInfo,
        changeStyle,
    }


}