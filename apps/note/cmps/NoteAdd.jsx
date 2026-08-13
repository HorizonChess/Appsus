const { useState, useEffect } = React

export function NoteAdd({ emptyNote, addNote }) {
    const [inputType, setInputType] = useState('NoteTxt')
    const [emptyNoteToEdit, setEmptyNoteToEdit] = useState(emptyNote)

    useEffect(() => {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, type: inputType })
    }, [inputType])

    function onInputChange(emptyNoteToEdit, newInfo) {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, info: newInfo })
    }

    return <div>
        <DynamicAddNote
            inputType={inputType}
            emptyNoteToEdit={emptyNoteToEdit}
            info={emptyNote.info}
            onInputChange={onInputChange} />
        <button onClick={() => addNote(emptyNoteToEdit)}>Submit</button>
    </div>
}

function AddTxt({ info, emptyNoteToEdit, onInputChange }) {

    return <textarea onChange={(ev) => {
        const newInfo = { txt: ev.target.value }
        onInputChange(emptyNoteToEdit, newInfo)
    }}
        name=""
        id="">

    </textarea>
}

function DynamicAddNote(props) {
    const cmpMap = {
        'NoteTxt': <AddTxt {...props} />,
        // 'NoteTodos': <NoteTodos {...props} />,
        // 'NoteImg': <NoteImg {...props} />,
        // 'NoteVideo': <NoteVideo {...props} />,
        // 'NoteAudio': <NoteAudio {...props} />
    }

    return cmpMap[props.inputType]
}