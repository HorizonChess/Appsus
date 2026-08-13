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
    remove

}

window.ns = noteService

function query(filterBy = {}) {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            if (filterBy.txt) {
                notes = _filterByText(notes, filterBy.txt)
            }

            if (filterBy.isPinned) {
                notes = notes.filter(note => note.isPinned)
            }

            if (filterBy.type) {
                notes = notes.filter(note => note.type === filterBy.type)
            }

            return notes
        })
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(note => note)
}

function save(note) {
    if (note.id) {
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
        id: utilService.makeId(),
        createdAt: Date.now()
    }

}

function getEmptyNote(type = 'NoteTxt', info = {}, style = { backgroundColor: '#ffffff' }) {
    return {
        type,
        info,
        style
    }
}

function _filterByText(notes, text) {
    const regExp = new RegExp(text, 'i')


    return notes.filter(note => {
        const { info } = note
        if (!info) return false

        var isContainTxt = false

        const { title, txt, todos } = note.info

        if (title) isContainTxt = regExp.test(title)

        if (txt) isContainTxt = regExp.test(txt)

        if (todos) isContainTxt = todos.some(todo => {
            return regExp.test(todo.txt)
        })

        return isContainTxt
    })
}