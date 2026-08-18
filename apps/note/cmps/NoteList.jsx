import { eventBusService } from "../../../services/event-bus.service.js"

import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
const { useState, useRef } = React

export function NoteList({ notes, updateNote, onRemoveNote, onChangeStyle, onOpenModal, onChangeInfo }) {
    const [colorPickerId, setColoPickerId] = useState(null)
    const backdropRef = useRef()
    console.log('colorPickerId', colorPickerId)

    function handleColorPickerOpen(ev, colorPickerId) {
        console.log('ev', ev)
        ev.stopPropagation()
        setColoPickerId(colorPickerId)
        console.log('backdropRef.current.styl.display', backdropRef.current.style.display)
        backdropRef.current.style.display = 'unset'
    }

    function handleColorPickerClose() {
        setColoPickerId(null)
        backdropRef.current.style.display = 'none'

    }

    // function handleClick(ev, noteId) {
    //     ev.stopPropagation()
    //     if (noteId) {
    //         console.log('hi')
    //         setColoPickerId(noteId)
    //     }
    //     else if (colorPickerId) setColoPickerId(null)
    // }


    return <ul className="notes" >
        {notes.map(note => {
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

                    <ColorPicker isPickerShown={note.id === colorPickerId} key={`${note.id}-colorpicker`} />
                </article>

            </li>

        })}
        <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>

    </ul>
}
