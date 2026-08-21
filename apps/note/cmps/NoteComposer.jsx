import { eventBusService } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ComposerToolbar } from "./ComposerToolbar.jsx"
import { ImgEditor } from "./ImgEditor.jsx"

export function NoteComposer({ note, onChangeInfo, onChangeType, addNote,onTogglePinEmptyNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPinned, setIsPinned] = useState(false)

    useEffect(() => {
        eventBusService.on('note-edit', collapseComposer)
    }, [])

    function collapseComposer(msg) {
        setNoteType('NoteTxt')
        setIsExpanded(false)
    }

    function handleChange(info) {
        onChangeInfo(info)
    }

    function onChangeNoteType(type, ev) {
        if ((type) === 'NoteImg') {

            const reader = new FileReader()

            reader.readAsDataURL(ev.target.files[0])

            reader.onload = function (event) {
                const img = new Image()

                img.onload = () => {
                    onChangeType(type)
                    handleChange({ ...note.info, url: img.src })
                    setNoteType(type)
                    setIsExpanded(true)
                }
                img.src = event.target.result
            }

        } else {
            setNoteType(type)
            onChangeType(type)
            setIsExpanded(true)
        }

    }

    function handleTogglePinChange() {
        setIsPinned(!isPinned)
        onTogglePinEmptyNote(note.id)
    }

    function onSubmit() {
        setIsExpanded(!isExpanded)
        addNote()
        setNoteType('NoteTxt')
        setIsPinned(false)
    }

    function onExpandComposer(ev) {
        ev.preventDefault()
onloadEmptyNote()
        setIsExpanded(true)
    }

    if (!isExpanded) {
        return < section className="note-composer collapsed">
            <h3 className="composer-placeholder"
                onClick={onExpandComposer}>Write a note...</h3>
            <ComposerToolbar onChangeNoteType={onChangeNoteType} />

        </section>
    }

    return < section className="note-composer expanded">
        <TitleEditor info={note.info} onChangeTitle={handleChange} isEditMode={true} />


        <DynamicEditor
            key={`note#${note.id}-editor`}
            cmpType={noteType}
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
        'NoteImg': <ImgEditor {...props} />

    }
    return cmpMap[props.cmpType]
}