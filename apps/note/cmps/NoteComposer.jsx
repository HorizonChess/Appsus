import { eventBusService } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ComposerToolbar } from "./ComposerToolbar.jsx"

export function NoteComposer({ note, onChangeInfo, onChangeType, addNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')
    const [isExpanded, setIsExpanded] = useState(false)

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

    function onChangeNoteType(type) {
        setNoteType(type)
        onChangeType(type)
    }

    function onSubmit() {
        setIsExpanded(!isExpanded)
        addNote()
        setNoteType('NoteTxt')
    }

    function onExpandComposer() {
        setIsExpanded(true)
    }

    if (!isExpanded || note.id) {
        return < section onClick={onExpandComposer} className="note-composer collapsed">
            <h3 className="composer-placeholder">Write a note...</h3>
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



        <button className="note-submit-btn" onClick={onSubmit}>
            <i className="fa-solid fa-play"></i>
        </button>

    </section>
}


function DynamicEditor(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,

    }
    return cmpMap[props.cmpType]
}