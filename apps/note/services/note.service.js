// note service
import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

import { demoNotes } from '../data/demo.data.js'

console.log('demoNotes', demoNotes)
const NOTES_KEY = 'notes'
_createNotes()

export const noteService = {
    query,
    _createNote,
    getEmptyNote

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

function getEmptyNote(type = 'NoteTxt', info = {}) {
    return {
        type,
        info
    }
}

function _filterByText(notes, text) {
    const regExp = new RegExp(text, 'i')

    return notes.filter(note => {
        const {info} = note
        if (!info) return false
        console.log(note)
        const { title, txt } = note.info
        
        console.log('txt',txt)
        if (title) return regExp.test(title)

        if (txt) return regExp.test(txt)
    })
}