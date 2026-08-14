const { useState, useEffect } = React

import { NoteTitle } from "./NoteTitle.jsx"
import { NoteTxt } from "./NoteTxt.jsx"

export function NoteAdd({ emptyNote, addNote }) {
    const [inputType, setInputType] = useState(null)
    const [emptyNoteToEdit, setEmptyNoteToEdit] = useState(JSON.parse(JSON.stringify(emptyNote)))

    useEffect(() => {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, type: inputType })
    }, [inputType])

    function onInputChange(demptyNoteToEdit, newInfo, todo) {

        setEmptyNoteToEdit({ ...emptyNoteToEdit, info: newInfo })
    }

    if (!inputType) return <fieldset className="add-note">
        <input
            placeholder="Take a note..."
            className="add-input title"
            onClick={() => setInputType('NoteTxt')}
            type="text"
        />

        <button
            className="change-type-btn"
            onClick={() => setInputType('NoteTodos')}
        >
            <i class="fa-regular fa-square-check"></i>
        </button>
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
    const { title, todos } = info
    const newTodos = todos ? todos : [{ txt: '', isDone: false }]
    info.todos = newTodos

    function onAddTodo() {
        newTodos.push({ txt: '', isDone: false })
        const newInfo = { ...info, todos: newTodos }
        onInputChange(emptyNoteToEdit, newInfo)
    }

    function onChangeTodos(info, name, newValue, idx, ev) {

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
                />
                <input type="checkbox" key={`todo-check-${idx}`}
                    id={`check-${idx}`}
                    name='isDone'
                    checked={todo.isDone}
                    onChange={(ev) => onChangeTodos(info, 'isDone', ev.target.value, idx)} />

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
        />
    </div>
}

function DynamicAddNote(props) {
    const cmpMap = {
        'NoteTxt': <AddTxt {...props} />,
        'NoteTodos': <AddTodos {...props} />,
        // 'NoteImg': <NoteImg {...props} />,
        // 'NoteVideo': <NoteVideo {...props} />,
        // 'NoteAudio': <NoteAudio {...props} />
    }

    return cmpMap[props.inputType]
}