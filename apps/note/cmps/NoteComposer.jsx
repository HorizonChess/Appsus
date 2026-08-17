import { eventBusService } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ComposerToolbar } from "./ComposerToolbar.jsx"

export function NoteComposer({ note, onChangeInfo, onChangeType, addNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')
    const [isExpanded, setIsExpanded] = useState(false)

    console.log('isExpanded', isExpanded)

    useEffect(() => {
        onChangeType(noteType)
    }, [noteType])

    useEffect(() => {
        eventBusService.on('note-edit', collapseComposer)
    }, [])

    function collapseComposer(msg) {
        setIsExpanded(false)

    }

    function handleChange(info) {
        onChangeInfo(info)
    }

    function onChangeNoteType(type) {
        setNoteType(type)
    }

    function onSubmit() {
        setIsExpanded(!isExpanded)
        addNote()
        console.log('onSubmit')
        // setNoteType('NoteTxt')
    }

    function onExpandComposer() {
        setIsExpanded(true)
    }

    if (!isExpanded || note.id) {
        return < section onClick={onExpandComposer} className="note-composer">
            <h3>Write a note...</h3>
        </section>
    }

    return < section className="note-composer">
        <TitleEditor info={note.info} onChangeTitle={handleChange} isEditMode={true} />


        <DynamicEditor
            key={`note#${note.id}-editor`}
            cmpType={noteType}
            info={note.info}
            isEditMode={true}
            onChangeVal={handleChange} />


        <ComposerToolbar onChangeNoteType={onChangeNoteType} />

        <button onClick={onSubmit}>
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
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