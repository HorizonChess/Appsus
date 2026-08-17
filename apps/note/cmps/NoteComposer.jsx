const { useState, useEffect } = React
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ComposerToolbar } from "./ComposerToolbar.jsx"

export function NoteComposer({ note, onChangeInfo, onChangeType, addNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')

    useEffect(() => {
        onChangeType(noteType)
    }, [noteType])

    function handleChange(info) {
        onChangeInfo(info)
    }

    function onChangeNoteType(type) {
        onChangeInfo({})
        setNoteType(type)
    }

    function onSubmit() {
        addNote()
        setNoteType('NoteTxt')

    }

    return <section className="note-composer">
        <TitleEditor info={note.info} onChangeTitle={handleChange} />

        <DynamicEditor
            key={`note#${note.id}-editor`}
            cmpType={noteType}
            info={note.info}
            onChangeVal={handleChange} />

        <ComposerToolbar onChangeNoteType={onChangeNoteType} />

        <button onClick={onSubmit}>Submit</button>

    </section>
}


function DynamicEditor(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,

    }
    return cmpMap[props.cmpType]
}