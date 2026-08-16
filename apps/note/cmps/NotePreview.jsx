const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"
import { NoteToolbar } from "./NoteToolbar.jsx"

export function NotePreview({ note, updateNote }) {

    return <DynamicNote
        key={note.id}
        type={note.type}
        info={note.info} />

}

function NoteTxt({ info, key }) {
    const { title, txt } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>
        <p className="note-txt">{txt}</p>
    </div>
}

function NoteTodos({ info, key }) {
    const { title, todos } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>
        {todos.map(todo => {
            return <div className="todo-list" key={todo.txt}>
                <label className="note-txt" htmlFor={todo.txt}>{todo.txt}</label>
                <input className="note-todo-checkbox" type="checkbox" id={todo.txt} name={todo.txt} checked={todo.isDone} />

            </div>
        })}
    </div>
}

function NoteImg({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3 className="note-title">{title}</h3>
        <img src={url} alt="" className="note-media"/>
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