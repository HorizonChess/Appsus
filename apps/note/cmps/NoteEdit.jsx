const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"
import { NoteToolbar } from "./NoteToolbar.jsx"
import { NoteTodoCheckMark } from "./NoteTodoCheckmark.jsx"
import { NoteInputTxt } from "./NoteInputTxt.jsx"

export function NoteEdit({ note, updateNote, onChangeInfo }) {

    return <DynamicNote
        key={note.id}
        type={note.type}
        info={note.info}
        onChangeInfo={onChangeInfo} />

}

function NoteTxt({ info, key, onChangeInfo }) {
    const { txt, title } = info

    function onChangeTxt(newTxt) {
        info.txt = newTxt
        onChangeInfo({ ...info })
    }

    function onChangeTitle(newTitle) {
        info.title = newTitle
        onChangeInfo({ ...info })
    }

    return <div className="note-content" key={key}>
        <NoteInputTxt txt={title} onChangeTxt={onChangeTitle} key={key} className={'note-title'} />

        <NoteInputTxt txt={txt} onChangeTxt={onChangeTxt} key={key} className={'note-txt'} />
    </div>
}

function NoteTodos({ info, key, onChangeInfo }) {
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

function NoteImg({ info, key, onChangeInfo }) {
    const { title, url } = info

    function onChangeTitle(newTitle) {
        info.title = newTitle
        onChangeInfo({ ...info })
    }

    return <div className="note-content" key={key}>
        < NoteInputTxt txt={title} onChangeTxt={onChangeTitle} key={key} className={'note-title'} />

        <img src={url} alt="" className={"note-media"} />
    </div>
}

function NoteVideo({ info, key, onChangeInfo }) {
    const { title, url } = info

    function onChangeTitle(newTitle) {
        info.title = newTitle
        onChangeInfo({ ...info })
    }

    return <div className="note-content" key={key}>
        < NoteInputTxt txt={title} onChangeTxt={onChangeTitle} key={key} className={'note-title'} />

        <video controls width="200" className="note-media">
            <source src={url} type="video/webm" />
            <source src={url} type="video/mp4" />
        </video>
    </div>
}

function NoteAudio({ info, key,onChangeInfo }) {
    const { title, url } = info

    function onChangeTitle(newTitle) {
        info.title = newTitle
        onChangeInfo({ ...info })
    }
    return <div className="note-content" key={key}>
        < NoteInputTxt txt={title} onChangeTxt={onChangeTitle} key={key} className={'note-title'} />
        
        <figure  className="note-media">
            <audio controls src={url}></audio>
        </figure>
    </div>
}
function DynamicNote(props) {
    const cmpMap = {
        'NoteTxt': <NoteTxt {...props} />,
        'NoteTodos': <NoteTodos {...props} />,
        'NoteImg': <NoteImg {...props} />,
        'NoteVideo': <NoteVideo {...props} />,
        'NoteAudio': <NoteAudio {...props} />
    }

    return cmpMap[props.type]
}