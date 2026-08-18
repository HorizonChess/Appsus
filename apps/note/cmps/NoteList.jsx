import { eventBusService } from "../../../services/event-bus.service.js"

import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
const { useState, useRef } = React

export function NoteList({ notes, updateNote, onRemoveNote, onChangeStyle, onOpenModal, onChangeInfo }) {
    const [colorPickerId, setColoPickerId] = useState(null)
    const backdropRef = useRef()

    function handleColorPickerOpen(ev, colorPickerId) {
        ev.stopPropagation()
        setColoPickerId(colorPickerId)
        backdropRef.current.style.display = 'unset'
    }

    function handleColorPickerClose() {
        setColoPickerId(null)
        backdropRef.current.style.display = 'none'

    }

    return <ul className="notes" >
        {notes.map(note => {
            console.log('note.id',note.id)
            return <li key={note.id}>
                <article key={note.id} className="note" style={note.style} >
                    <NotePreview
                        note={note}
                        updateNote={updateNote}
                        onChangeInfo={onChangeInfo} />

                    <button
                        className="remove-note-btn"
                        onClick={() => onRemoveNote(note.id)}><i class="fa-solid fa-circle-xmark"></i></button>

                    <div className='note-toolbar'>
                        <button onClick={ev => handleColorPickerOpen(ev, note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
                        <button onClick={() => onOpenModal(note.id)} className="toolbar-btn"><i className="fa-solid fa-pencil"></i></button>
                    </div>

                    <ColorPicker isPickerShown={note.id === colorPickerId} key={`${note.id}-colorpicker`} style={note.style} onChangeStyle={ev => onChangeStyle(ev, note)} />
                </article>

            </li>

        })}
        <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>

    </ul>
}
