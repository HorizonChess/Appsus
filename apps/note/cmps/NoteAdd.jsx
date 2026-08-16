const { useState, useEffect } = React

import { NoteCheck } from "./NoteCheck.jsx"
import { NoteTitle } from "./NoteTitle.jsx"
import { NoteTxt } from "./NoteTxt.jsx"
import { NoteImg } from "./NoteImg.jsx"
import { NoteTodoCheckMark } from "./NoteTodoCheckmark.jsx"

export function NoteAdd({ emptyNote, addNote, onChangeInfo, children ,onChangeInputType}) {
    const [inputType, setInputType] = useState(null)
    const [emptyNoteToEdit, setEmptyNoteToEdit] = useState({...emptyNote})
    
    useEffect(() => {
        setInputType(emptyNoteToEdit.type)
    }, [emptyNoteToEdit])
    
    useEffect(() => {
        setEmptyNoteToEdit({...emptyNote})
    }, [emptyNote])


    function onImgInput(ev, emptyNoteToEdit) {
        const newInfo = { ...emptyNoteToEdit.info, url: ev.target.files[0] }
        onInputChange(emptyNoteToEdit, newInfo)
        setInputType('NoteImg')
    }

    if (!inputType) return <fieldset className="add-note">
        <input
            placeholder="Take a note..."
            className="add-input title"
            onClick={() => {
                
                onChangeInputType('NoteTxt')}}
            type="text"
        />

        <div className="note-add-toolbar">
            <button
                className="change-type-btn"
                onClick={() => onChangeInputType('NoteTodos')}> <i class="fa-regular fa-square-check"></i>
            </button>


            <label for="file-upload" class="change-type-btn">
                <i class="fa-regular fa-image"></i>
            </label>
            <input id="file-upload" type="file" onChange={ev => onImgInput(ev, emptyNoteToEdit)} />

            <button
                className="change-type-btn"
                onClick={() => onChangeInputType('NoteVideo')}
            > <i class="fa-brands fa-youtube"></i></button>

            <button
                className="change-type-btn"
                onClick={() => onChangeInputType('NoteAudio')}
            > <i class="fa-solid fa-volume-high"></i></button>
        </div>




    </fieldset >

    return <fieldset className="add-note">
        {children}
        <button
            className="submit-note-btn"
            onClick={() => {
                addNote(emptyNoteToEdit)
                // setEmptyNoteToEdit(nul)
                setInputType(null)
            }}

        >
            <i class="fa-solid fa-play"></i>
        </button>

    </fieldset>
}

// function AddTodos({ info, emptyNoteToEdit, onInputChange }) {
//     const { todos } = info
//     const newTodos = todos ? todos : [{ txt: '', isDone: false }]
//     info.todos = newTodos

//     function onAddTodo() {
//         newTodos.push({ txt: '', isDone: false })
//         const newInfo = { ...info, todos: newTodos }
//         onInputChange(emptyNoteToEdit, newInfo)
//     }

//     function onChangeTodos(info, name, newValue, idx) {

//         const newInfo = { ...info }
//         if (name === 'title') {
//             newInfo.title = newValue
//         } else {
//             const todo = newInfo.todos[idx]
//             todo[name] = newValue
//         }

//         onInputChange(emptyNoteToEdit, newInfo)
//     }

//     return <div className="note-content" >
//         <NoteTitle
//             note={emptyNoteToEdit}
//             info={info}
//             onInputChange={onInputChange}
//         />

//         {newTodos.map((todo, idx) => {
//             return <div className="todo-list" key={`todo-text-${idx}`}>
//                 <NoteTxt
//                     onInputChange={ev => onChangeTodos(info, 'txt', ev.target.value, idx)}
//                     value={todo.txt}
//                     id={`todo-${idx}`}
//                     placeholder={'Enter a new task...'}
//                 />

//                 <NoteTodoCheckMark
//                     isChecked={todo.isDone}
//                     onInputChange={ev => onChangeTodos(info, 'isDone', ev.target.value, idx)}
//                     id={`todo-check-${idx}`} />

//             </div>
//         })}

//         <button onClick={onAddTodo} className="add-todo">+</button>
//     </div>
// }

function AddTodos({ info, key, onChangeInfo }) {
    const { title, todos } = info

    function onChangeTitle(newTitle) {
        info.title = newTitle
        onChangeInfo({ ...info })
    }

    function onChangeTxt(txt) {
        onChangeInfo({ ...info, txt })
    }

    function onChangeTodoTxt(newTxt, todo) {
        todo.txt = newTxt
        onChangeInfo({ ...info })

    }
    function onAddTodo() {
        const newTodo = { txt: '', isDone: false }
        info.todos.push(newTodo)
        onChangeInfo({ ...info })

    }

    function onChangeTodoCheck(todo) {
        todo.isDone = !todo.isDone
        onChangeInfo({ ...info })
    }

    return <div className="note-content" key={key}>

        <NoteInputTxt txt={title} onChangeTxt={onChangeTitle} key={key} className={'note-title'} />

        {todos.map((todo, idx) => {
            return <div className="todo-list" key={todo.txt}>
                <NoteInputTxt todo={todo} txt={todo.txt} onChangeTxt={onChangeTodoTxt} key={key} className={'note-txt'} />
                <NoteTodoCheckMark todo={todo} onChangeTodo={onChangeTodoCheck} idx={idx} className={'note-todo-checkbox'} />
            </div>
        })}

        <button className="todo-add" onClick={onAddTodo}>+</button>
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
    if (typeof (info.url) !== 'string') {
        const reader = new FileReader()

        reader.onload = function (event) {
            const img = new Image()
            img.onload = () => {
                const newInfo = { ...emptyNoteToEdit.info, url: event.target.result }
                onInputChange(emptyNoteToEdit, newInfo)
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(info.url)
    }


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