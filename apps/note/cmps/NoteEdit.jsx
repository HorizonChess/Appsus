const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"

import { ColorPicker } from "./ColorPicker.jsx"
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ImgEditor } from "./ImgEditor.jsx"
import { VideoEditor } from "./VideoEditor.jsx"
import { AudioEditor } from "./VideoEditor.jsx"

export function NoteEdit({ note, updateNote, onChangeInfo, onChangeStyle, onTogglePinNote }) {
    const [isColorPickerShown, setIsColorPickerShown] = useState(null)
    const [noteEditStyle, setNoteEditStyle] = useState(note.style)
    const [isPinned, setIsPinned] = useState(note.isPinned)

    console.log('isPinned', isPinned)
    const backdropRef = useRef()

    function handleChange(info, noteId) {
        onChangeInfo(info, noteId)
    }

    function handleColorPickerOpen(ev) {
        ev.stopPropagation()
        setIsColorPickerShown(true)
        backdropRef.current.style.display = 'unset'
    }

    function handleColorPickerClose() {
        setIsColorPickerShown(false)
        backdropRef.current.style.display = 'none'

    }

    function handleTogglePinChange() {
        setIsPinned(!isPinned)
        onTogglePinNote(note)
    }

    function handleColorChange(ev) {
        setNoteEditStyle({ backgroundColor: ev.target.value })
        onChangeStyle(ev, note)
    }

    return <section className="note-edit" style={noteEditStyle}>
        <TitleEditor info={note.info} isEditMode={true} onChangeTitle={handleChange} />

        <DynamicNoteEdit
            key={`note#${note.id}-editor`}
            cmpType={note.type}
            info={note.info}
            isEditMode={true}
            onChangeVal={handleChange}
            noteId={note.id}
        />

        <div className='note-edit-toolbar'>
            <button onClick={ev => handleColorPickerOpen(ev, note.id)} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
        </div>

        <ColorPicker isPickerShown={isColorPickerShown} key={`${note.id}-colorpicker`} style={note.style} onChangeStyle={handleColorChange} />


        {isPinned && <button onClick={handleTogglePinChange} className="note-pin pinned">
            <i className="fa-solid fa-thumbtack"></i>

        </button>}
        {!isPinned && <button onClick={handleTogglePinChange} className="note-pin pinned">
            <i className="fa-solid fa-thumbtack-slash"></i>

        </button>}

        <div className="color-picker-backdrop" onClick={handleColorPickerClose} ref={backdropRef}></div>

    </section>
}

function DynamicNoteEdit(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,
        'NoteImg': <ImgEditor {...props} />,
        'NoteVideo': <VideoEditor {...props} />,
        'NoteAudio': <AudioEditor {...props} />
    }

    return cmpMap[props.cmpType]
}