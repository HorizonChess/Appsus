const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"
import { NoteToolbar } from "./NoteToolbar.jsx"
import { NoteInputTxt } from "./NoteInputTxt.jsx"
import { NoteTodoCheckMark } from "./NoteTodoCheckmark.jsx"

export function NotePreview({ note, updateNote, onChangeInfo }) {

    return <DynamicNote
        noteId={note.id}
        key={note.id}
        type={note.type}
        info={note.info}
        onChangeInfo={onChangeInfo} />

}

function NoteTxt({ info, key }) {
    const { title, txt } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>
        <p className="note-txt">{txt}</p>
    </div>
}

function NoteTodos({ info, key, onChangeInfo,noteId }) {
    const { title, todos } = info

    function onChangeTodoCheck(todo) {
        todo.isDone = !todo.isDone
        onChangeInfo({ ...info },noteId)
    }

    return <div className="note-content" key={key}>

        <NoteInputTxt txt={title} key={key} className={'note-title'} />

        {todos.map((todo, idx) => {
            return <div className="todo-list" key={todo.txt}>
                <NoteInputTxt todo={todo} txt={todo.txt} key={key} className={'note-txt'} />
                <NoteTodoCheckMark todo={todo} onChangeTodo={onChangeTodoCheck} idx={idx} className={'note-todo-checkbox'} />
            </div>
        })}

    </div>
}

function NoteImg({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>
        <img src={url} alt="" className="note-media" />
    </div>
}

function NoteVideo({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>

        <video controls width="200" className="note-media">
            <source src={url} type="video/webm" />
            <source src={url} type="video/mp4" />
        </video>
    </div>
}

function NoteAudio({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>

        <figure className="note-media">
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