import { eventBusService } from "../../../services/event-bus.service.js"

import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
const { useState, useRef } = React

export function NoteList({ notes, updateNote, onRemoveNote, onChangeStyle, onOpenModal, onChangeInfo }) {
    const [colorPickerId, setColoPickerId] = useState(null)
    const backdropRef = useRef()

    const pinnedNotes = notes.filter(note => note.isPinned)
    const unpinnedNotes = notes.filter(note => !note.isPinned)

    function handleColorPickerOpen(ev, colorPickerId) {
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
            <ul className="note-list" >
                {pinnedNotes.map(note => {

                    return <li key={note.id}>
                        <article key={note.id} className="note" style={note.style} >
                            <NotePreview
                                note={note}
                                updateNote={updateNote}
                                onChangeInfo={onChangeInfo} />

                            <button
                                className="remove-note-btn"
                                onClick={() => onRemoveNote(note.id)}><i className="fa-solid fa-circle-xmark"></i></button>

                            <div className='note-toolbar'>
                                <button onClick={ev => handleColorPickerOpen(ev, note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
                                <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i className="fa-solid fa-pencil"></i></button>
                            </div>

                            <ColorPicker isPickerShown={note.id === colorPickerId} key={`${note.id}-colorpicker`} style={note.style} onChangeStyle={ev => onChangeStyle(ev, note)} />

                            <button className="note-pin pinned">
                                <i class="fa-solid fa-thumbtack"></i>
                            </button>

                        </article>

                    </li>

                })}
                <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>
            </ul>
        </section>


        <section className="unpinned-notes">
            <ul className="note-list" >
                {unpinnedNotes.map(note => {

                    return <li key={note.id}>
                        <article key={note.id} className="note" style={note.style} >
                            <NotePreview
                                note={note}
                                updateNote={updateNote}
                                onChangeInfo={onChangeInfo} />

                            <button
                                className="remove-note-btn"
                                onClick={() => onRemoveNote(note.id)}><i className="fa-solid fa-circle-xmark"></i></button>

                            <div className='note-toolbar'>
                                <button onClick={ev => handleColorPickerOpen(ev, note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
                                <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i className="fa-solid fa-pencil"></i></button>
                            </div>

                            <ColorPicker isPickerShown={note.id === colorPickerId} key={`${note.id}-colorpicker`} style={note.style} onChangeStyle={ev => onChangeStyle(ev, note)} />

                            <button className="note-pin unpinned">
                                <i className="fa-solid fa-thumbtack-slash"></i>                            </button>
                        </article>

                    </li>

                })}
                <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>

            </ul>
        </section>

    </section>

}
