import { eventBusService } from "../../../services/event-bus.service.js"

import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
const { useState, useRef } = React

export function NoteList({ notes, onUpdateNote, onRemoveNote,
    onChangeStyle, onOpenModal, onChangeInfo, onTogglePinNote, onDuplicateNote }) {
    const [colorPickerId, setColoPickerId] = useState(null)
    const backdropRef = useRef()

    const pinnedNotes = notes.filter(note => note.isPinned)
    const unpinnedNotes = notes.filter(note => !note.isPinned)

    function handleColorChange(ev, noteId) {
        onUpdateNote(noteId, onChangeStyle, ev.target.value)
    }

    function handleInfoChange(info, noteId) {
        onUpdateNote(noteId, onChangeInfo, info)

    }

    function handlePinChange(noteId){
         onUpdateNote(noteId, onTogglePinNote)
    }

    function handleColorPickerOpen(ev, colorPickerId) {
        eventBusService.emit('click', ev)
        ev.stopPropagation()
        setColoPickerId(colorPickerId)
        backdropRef.current.style.display = 'unset'
    }

    function handleColorPickerClose() {
        setColoPickerId(null)
        backdropRef.current.style.display = 'none'

    }

    return <section className="notes">

        <section className="pinned-notes">
            <div className="pin-label">Pinned</div>

            <ul className="note-list" >
                {(pinnedNotes.length > 0) && pinnedNotes.map(note => {

                    return <li key={note.id}>
                        <article key={note.id} className="note" style={note.style} draggable={true} >
                            <NotePreview
                                note={note}
                                onChangeInfo={handleInfoChange} />

                            <button
                                className="remove-note-btn"
                                onClick={() => onRemoveNote(note.id)}><i className="fa-solid fa-circle-xmark"></i></button>

                            <div className='note-toolbar'>
                                <button onClick={ev => handleColorPickerOpen(ev, note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
                                <button onClick={ev => onOpenModal(note.id)} className="toolbar-btn" id='open-edit'><i className="fa-solid fa-pencil"></i></button>
                                <button onClick={ev => onDuplicateNote(note)} className="toolbar-btn"><i className="fa-regular fa-clone"></i></button>
                            </div>

                            <ColorPicker
                                isPickerShown={colorPickerId && note.id === colorPickerId}
                                key={`${note.id}-colorpicker`}
                                style={note.style}
                                onChangeStyle={ev => handleColorChange(ev, note.id)} />

                            <button onClick={ev => handlePinChange(note.id)} className="note-pin pinned">
                                <i className="fa-solid fa-thumbtack"></i>
                            </button>

                        </article>

                    </li>

                })}

                {pinnedNotes.length === 0 && <div><p>No matching notes...</p></div>}
                <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>
            </ul>
        </section>


        <section className="unpinned-notes">
            <div className="pin-label">Un-Pinned</div>

            <ul className="note-list" >
                {(unpinnedNotes.length > 0) && unpinnedNotes.map(note => {

                    return <li key={note.id}>
                        <article key={note.id} className="note" style={note.style} >
                            <NotePreview
                                note={note}
                                onChangeInfo={handleInfoChange} />

                            <button
                                className="remove-note-btn"
                                onClick={() => onRemoveNote(note.id)}><i className="fa-solid fa-circle-xmark"></i></button>

                            <div className='note-toolbar'>
                                <button onClick={ev => handleColorPickerOpen(ev, note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
                                <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i className="fa-solid fa-pencil"></i></button>
                                <button onClick={() => onDuplicateNote(note)} className="toolbar-btn"><i className="fa-regular fa-clone"></i></button>
                            </div>

                            <ColorPicker isPickerShown={note.id === colorPickerId} pickerKey={`${note.id}-colorpicker`} style={note.style} onChangeStyle={ev => handleColorChange(ev, note.id)} />

                            <button onClick={ev => handlePinChange(note.id)} className="note-pin unpinned">
                                <i className="fa-solid fa-thumbtack-slash"></i>                            </button>
                        </article>

                    </li>

                })}
                <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>
                {(unpinnedNotes.length === 0) && <div><p>No matching notes...</p></div>}
            </ul>
        </section>

    </section>

}
