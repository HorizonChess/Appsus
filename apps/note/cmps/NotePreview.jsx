const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"
import { NoteToolbar } from "./NoteToolbar.jsx"
import { NoteInputTxt } from "./NoteInputTxt.jsx"
import { NoteTodoCheckMark } from "./NoteTodoCheckmark.jsx"
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"

export function NotePreview({ note, updateNote, onChangeInfo }) {

    function handleChange(info,noteId) {
        console.log(noteId)
        onChangeInfo(info,noteId)
    }
    return <section>
        <TitleEditor info={note.info} isEditMode={false} />

        <DynamicPreview
            key={`note#${note.id}-editor`}
            cmpType={note.type}
            info={note.info}
            isEditMode={false}
            onChangeVal={handleChange}
            noteId={note.id}
        />

    </section>


}

function DynamicPreview(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,
        // 'NoteImg': <NoteImg {...props} />,
        // 'NoteVideo': <NoteVideo {...props} />,
        // 'NoteAudio': <NoteAudio {...props} />
    }

    return cmpMap[props.cmpType]
}