
import { noteService } from "../services/note.service.js"
import { eventBusService } from "../../../services/event-bus.service.js"

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteModal } from "../cmps/NoteModal.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"

import { useNotes } from "../custom-hooks/useNotes.js"
import { NoteFuncContext } from "../custom-hooks/note-func.context.js"

export function NoteIndex() {
    const {
        notes, filterBy, setFilterBy, updateNote,
        addNote, removeNote, duplicateNote, openNote,
        openNoteId, togglePinNote, changeInfo, changeStyle,
    } = useNotes()


    function onOpenModal(noteId) {
        setFilterBy({ ...filterBy, noteId })
    }

    function onCloseModal() {
        setFilterBy({ ...filterBy, noteId: '' })

    }

    return <section className="notes-container note-layout" onClick={ev => eventBusService.emit('click', ev)}>
        <NoteFuncContext.Provider value={updateNote}>

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
                onTogglePinNote={togglePinNote}
                onRemoveNote={removeNote}
                onChangeStyle={changeStyle}
                onOpenModal={onOpenModal}
                onChangeInfo={changeInfo}
                onDuplicateNote={duplicateNote}
                onUpdateNote={updateNote}
            />


            <NoteModal
                isShown={openNote}
                onClose={onCloseModal}
                style={openNoteId && openNoteId.style}
            >
                {openNote ?

                    <NoteEdit
                        note={openNote}
                        onUpdateNote={updateNote}
                        onChangeInfo={changeInfo}
                        onChangeStyle={changeStyle}
                        onTogglePinNote={togglePinNote} />
                    :
                    <span></span>}
            </NoteModal>

        </NoteFuncContext.Provider>
    </section>
}
