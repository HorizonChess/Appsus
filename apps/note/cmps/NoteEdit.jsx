const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"
import { NoteToolbar } from "./NoteToolbar.jsx"
import { NoteTodoCheckMark } from "./NoteTodoCheckmark.jsx"
import { NoteInputTxt } from "./NoteInputTxt.jsx"

import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"

export function NoteEdit({ note, updateNote, onChangeInfo }) {

    function handleChange(info,noteId) {
        onChangeInfo(info,noteId)
    }
    

    return <section>
        <TitleEditor info={note.info} isEditMode={true} onChangeTitle={handleChange} />

        <DynamicNoteEdit
            key={`note#${note.id}-editor`}
            cmpType={note.type}
            info={note.info}
            isEditMode={true}
            onChangeVal={handleChange}
            noteId={note.id}
        />

    </section>


}

function DynamicNoteEdit(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,
        // 'NoteImg': <NoteImg {...props} />,
        // 'NoteVideo': <NoteVideo {...props} />,
        // 'NoteAudio': <NoteAudio {...props} />
    }

    return cmpMap[props.cmpType]
}