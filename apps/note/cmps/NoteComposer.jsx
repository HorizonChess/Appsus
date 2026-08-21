import { eventBusService } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
import { AudioEditor } from "./AudioEditor.jsx"
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ComposerToolbar } from "./ComposerToolbar.jsx"
import { ImgEditor } from "./ImgEditor.jsx"

export function NoteComposer({ note, onChangeInfo, onChangeType, addNote, onTogglePinEmptyNote }) {
    // const [noteType, setNoteType] = useState('NoteTxt')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPinned, setIsPinned] = useState(false)

    useEffect(() => {
        eventBusService.on('note-edit', collapseComposer)
    }, [])

    function collapseComposer(msg) {
        // setNoteType('NoteTxt')
        setIsExpanded(false)
    }

    function handleChange(info) {
        onChangeInfo(info)
    }


    function handleTogglePinChange() {
        setIsPinned(!isPinned)
        onTogglePinEmptyNote(note.id)
    }

    function onSubmit() {
        setIsExpanded(!isExpanded)
        addNote()
        // setNoteType('NoteTxt')
        setIsPinned(false)
    }

    function onExpandComposer(ev) {
        ev.preventDefault()
        onloadEmptyNote()
        setIsExpanded(true)
    }

    if (!note || note.id) {
        return < section className="note-composer collapsed">
            <h3 className="composer-placeholder"
                onClick={ev => onChangeType('NoteTxt', ev)}>Write a note...</h3>

            <div className="composer-toolbar">
                <button
                    className="toolbar-btn"
                    onClick={ev => onChangeType('NoteTodos')}>
                    <i className="fa-regular fa-square-check"></i>
                </button>

                <input type="file"
                    accept="image/*,.pdf"
                    id="note-img-input"
                    name="note-img-input"
                    className="toolbar-btn" onChange={ev => {
                        ev.preventDefault()
                        onChangeType('NoteImg', ev)
                    }}
                />
                <label htmlFor="note-img-input"><i class="fa-regular fa-image"></i></label>

                <button
                    className="toolbar-btn"
                    onClick={ev => onChangeType('NoteAudio')}>
                    <i class="fa-solid fa-microphone"></i>
                </button>


            </div>
        </section>
    }


    return < section className="note-composer expanded">
        <TitleEditor info={note.info} onChangeTitle={handleChange} isEditMode={true} />


        <DynamicEditor
            key={`note#${note.id}-editor`}
            cmpType={note.type}
            info={note.info}
            isEditMode={true}
            onChangeVal={handleChange} />


        {isPinned && <button onClick={handleTogglePinChange} className="note-pin pinned">
            <i className="fa-solid fa-thumbtack"></i>

        </button>}
        {!isPinned && <button onClick={handleTogglePinChange} className="note-pin unpinned">
            <i className="fa-solid fa-thumbtack-slash"></i>
        </button>}

        <button className="note-submit-btn" onClick={onSubmit}>
            <i className="fa-solid fa-play"></i>
        </button>

    </section>
}


function DynamicEditor(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,
        'NoteImg': <ImgEditor {...props} />,
        'NoteAudio': <AudioEditor {...props} />

    }
    return cmpMap[props.cmpType]
}