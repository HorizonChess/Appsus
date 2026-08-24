// note service
import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

import { demoNotes } from '../data/demo.data.js'

console.log('demoNotes', demoNotes)
const NOTES_KEY = 'notes'
_createNotes()

export const noteService = {
    query,
    get,
    getEmptyNote,
    save,
    remove,
    getFilterFromSearchParams,
    getFilteredNotes

}

window.ns = noteService

function query(filterBy = {}) {
    return storageService.query(NOTES_KEY)
        .then(notes => getFilteredNotes(notes, filterBy))
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(note => note)
}

function save(note) {
    if (note.id) {
        note.updatedAt = Date.now()

        return storageService.put(NOTES_KEY, note)
    } else {

        return storageService.post(NOTES_KEY, note)
    }
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
        .then(() => console.log(`Note ${noteId} was successfully remove`))
        .catch(() => console.log(`Note ${noteId} does not exist`))
}

function _createNotes() {
    const notes = utilService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) {

        const newNotes = []
        for (var i = 0; i < demoNotes.length; i++) {
            newNotes.push(_createNote(demoNotes[i]))
        }

        utilService.saveToStorage(NOTES_KEY, newNotes)
    }
}

function _createNote(demoNote) {
    if (demoNote) {
        demoNote.id = utilService.makeId()
        return demoNote
    }

    return {
        ...getEmptyNote(),
        type: 'NoteTxt',
        id: utilService.makeId(),
        createdAt: Date.now()
    }

}

function getEmptyNote(type = 'NoteTxt', info = { title: '', txt: '' }, style = { backgroundColor: '#ffffff' }) {
    return {
        type,
        info,
        style
    }
}

function _filterByText(notes, text) {
    const regExp = new RegExp(text, 'i')

    const filterdeNotes = notes.filter(note => {
        const { info } = note

        if (!info) return false

        const { title, txt, todos } = note.info

        if (!text) return true

        if (title && regExp.test(title)) return true

        if (txt && regExp.test(txt)) return true

        if (todos && todos.some(todo => regExp.test(todo.txt))) return true

        return false
    })

    return filterdeNotes
}

function getDefaultFilter(filterBy = { txt: '', type: '' }) {
    return { txt: filterBy.txt, type: filterBy.type }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}


function getFilteredNotes(notes, filterBy) {
    var filteredNotes = [...notes]
    if (filterBy.type) {
        filteredNotes = filteredNotes.filter(note => note.type === filterBy.type)
    }

    if (filterBy.txt) {
        filteredNotes = _filterByText(filteredNotes, filterBy.txt)
    }

    if (filterBy.isPinned) {
        filteredNotes = notes.filter(note => note.isPinned)
    }



    return filteredNotes

}