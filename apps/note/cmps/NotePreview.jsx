const { useState, useRef, useEffect } = React

import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ImgEditor } from "./ImgEditor.jsx"
import { VideoEditor } from "./VideoEditor.jsx"
export function NotePreview({ note, updateNote, onChangeInfo }) {

    function handleChange(info,noteId) {
        onChangeInfo(info,noteId)
    }
    return <section className="note-preview">
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
        'NoteImg': <ImgEditor {...props} />,
        'NoteVideo': <VideoEditor {...props} />,
        // 'NoteAudio': <NoteAudio {...props} />
    }

    return cmpMap[props.cmpType]
}