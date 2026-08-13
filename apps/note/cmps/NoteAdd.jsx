const { useState, useEffect } = React

export function NoteAdd({ emptyNote, addNote }) {
    const [inputType, setInputType] = useState('NoteTxt')
    const [emptyNoteToEdit, setEmptyNoteToEdit] = useState(emptyNote)

    console.log('emptyNoteToEdit.info', emptyNoteToEdit.info)
    useEffect(() => {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, type: inputType })
    }, [inputType])

    function onInputChange(emptyNoteToEdit, newInfo) {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, info: newInfo })
    }

    return <fieldset className="add-note">
        <DynamicAddNote
            inputType={inputType}
            emptyNoteToEdit={emptyNoteToEdit}
            info={emptyNoteToEdit.info}
            onInputChange={onInputChange} />
        <button onClick={() => addNote(emptyNoteToEdit)}>Submit</button>
    </fieldset>
}

function AddTxt({ info, emptyNoteToEdit, onInputChange }) {

    return <div className="add-txt">
        <input
            className="add-input title"
            type='text'
            placeholder="Enter Title"
            onChange={(ev) => {

                const newInfo = { ...info, title: ev.target.value }
                onInputChange(emptyNoteToEdit, newInfo)
            }}
            name=""
            id="">

        </input>

        <input
            className="add-input txt"
            type='text'
            placeholder="Enter Text"
            onChange={(ev) => {
                const newInfo = {...info,  txt: ev.target.value }
                onInputChange(emptyNoteToEdit, newInfo)
            }}
            name=""
            id="">

        </input>
    </div>

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