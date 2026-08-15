const { useState, useEffect } = React

import { NoteCheck } from "./NoteCheck.jsx"
import { NoteTitle } from "./NoteTitle.jsx"
import { NoteTxt } from "./NoteTxt.jsx"
import { NoteImg } from "./NoteImg.jsx"

export function NoteAdd({ emptyNote, addNote }) {
    const [inputType, setInputType] = useState(null)
    const [emptyNoteToEdit, setEmptyNoteToEdit] = useState(JSON.parse(JSON.stringify(emptyNote)))
    console.log('emptyNoteToEdit',emptyNoteToEdit)
    useEffect(() => {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, type: inputType })
    }, [inputType])

    function onInputChange(emptyNoteToEdit, newInfo) {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, info: newInfo })
    }

    function onImgInput(ev, emptyNoteToEdit) {
        loadImageFromInput(ev, emptyNoteToEdit)
    }

    function loadImageFromInput(ev, emptyNoteToEdit) {
        const reader = new FileReader()

        reader.onload = function (event) {
            const img = new Image()
            img.onload = () => {
                const newInfo = { ...emptyNoteToEdit.info, url: event.target.result }
                setInputType('NoteImg')
                onInputChange(emptyNoteToEdit, newInfo)
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(ev.target.files[0])

    }

    if (!inputType) return <fieldset className="add-note">
        <input
            placeholder="Take a note..."
            className="add-input title"
            onClick={() => setInputType('NoteTxt')}
            type="text"
        />

        <div className="note-add-toolbar">
            <button
                className="change-type-btn"
                onClick={() => setInputType('NoteTodos')}> <i class="fa-regular fa-square-check"></i>
            </button>


            <label for="file-upload" class="change-type-btn">
                <i class="fa-regular fa-image"></i>
            </label>
            <input id="file-upload" type="file" onChange={ev => onImgInput(ev, emptyNoteToEdit)} />

            <button
                className="change-type-btn"
                onClick={() => setInputType('NoteVideo')}
            > <i class="fa-brands fa-youtube"></i></button>

            <button
                className="change-type-btn"
                onClick={() => setInputType('NoteAudio')}
            > <i class="fa-solid fa-volume-high"></i></button>
        </div>




    </fieldset >

    return <fieldset className="add-note">
        <DynamicAddNote
            inputType={inputType}
            emptyNoteToEdit={emptyNoteToEdit}
            info={emptyNoteToEdit.info}
            onInputChange={onInputChange} />


        <button
            className="submit-note-btn"
            onClick={() => {
                addNote(emptyNoteToEdit)
                setEmptyNoteToEdit(emptyNote)
                setInputType(null)
            }}

        >
            <i class="fa-solid fa-play"></i>
        </button>

    </fieldset>
}

function AddTodos({ info, emptyNoteToEdit, onInputChange }) {
    const { todos } = info
    const newTodos = todos ? todos : [{ txt: '', isDone: false }]
    info.todos = newTodos

    function onAddTodo() {
        newTodos.push({ txt: '', isDone: false })
        const newInfo = { ...info, todos: newTodos }
        onInputChange(emptyNoteToEdit, newInfo)
    }

    function onChangeTodos(info, name, newValue, idx) {

        const newInfo = { ...info }
        if (name === 'title') {
            newInfo.title = newValue
        } else {
            const todo = newInfo.todos[idx]
            todo[name] = newValue
        }

        onInputChange(emptyNoteToEdit, newInfo)
    }

    return <div className="note-content" >
        <NoteTitle
            note={emptyNoteToEdit}
            info={info}
            onInputChange={onInputChange}
        />

        {newTodos.map((todo, idx) => {
            return <div className="todo-list" key={`todo-text-${idx}`}>
                <NoteTxt
                    onInputChange={ev => onChangeTodos(info, 'txt', ev.target.value, idx)}
                    value={todo.txt}
                    id={`todo-${idx}`}
                    placeholder={'Enter a new task...'}
                />

                <NoteCheck
                    isChecked={todo.isDone}
                    onInputChange={ev => onChangeTodos(info, 'isDone', ev.target.value, idx)}
                    id={`todo-check-${idx}`} />

            </div>
        })}

        <button onClick={onAddTodo} className="add-todo">+</button>
    </div>
}


function AddTxt({ info, emptyNoteToEdit, onInputChange }) {
    function onChangeInfoTxt(info, emptyNoteToEdit, ev) {
        const newInfo = { ...info, txt: ev.target.value }
        onInputChange(emptyNoteToEdit, newInfo)
    }

    return <div>
        <NoteTitle
            note={emptyNoteToEdit}
            info={info}
            onInputChange={onInputChange}
        />
        <NoteTxt
            onInputChange={ev => onChangeInfoTxt(info, emptyNoteToEdit, ev)}
            value={info.txt}
            id={`txt`}
            placeholder={'Enter text..'}
        />
    </div>
}

function AddImg({ info, emptyNoteToEdit, onInputChange }) {
    return <div>
        <NoteTitle
            note={emptyNoteToEdit}
            info={info}
            onInputChange={onInputChange}
        />
        <NoteImg
            info={info}
        />
    </div>
}

function AddVideo({ info, emptyNoteToEdit, onInputChange }) {
    function onChangeInfoUrl(info, emptyNoteToEdit, ev) {
        const newInfo = { ...info, url: ev.target.value }
        onInputChange(emptyNoteToEdit, newInfo)
    }

    return <div>
        <NoteTitle
            note={emptyNoteToEdit}
            info={info}
            onInputChange={onInputChange}
        />
        <NoteTxt
            onInputChange={ev => onChangeInfoUrl(info, emptyNoteToEdit, ev)}
            value={info.txt}
            id={`txt`}
            placeholder={'Enter a valid video URL..'}
        />
    </div>
}
function AddAudio({ info, emptyNoteToEdit, onInputChange }) {
    function onChangeInfoUrl(info, emptyNoteToEdit, ev) {
        const newInfo = { ...info, url: ev.target.value }
        onInputChange(emptyNoteToEdit, newInfo)
    }

    return <div>
        <NoteTitle
            note={emptyNoteToEdit}
            info={info}
            onInputChange={onInputChange}
        />
        <NoteTxt
            onInputChange={ev => onChangeInfoUrl(info, emptyNoteToEdit, ev)}
            value={info.txt}
            id={`txt`}
            placeholder={'Enter a valid Audio URL...'}
        />
    </div>
}


function DynamicAddNote(props) {
    const cmpMap = {
        'NoteTxt': <AddTxt {...props} />,
        'NoteTodos': <AddTodos {...props} />,
        'NoteImg': <AddImg {...props} />,
        'NoteVideo': <AddVideo {...props} />,
        'NoteAudio': <AddAudio {...props} />
    }

    return cmpMap[props.inputType]
}