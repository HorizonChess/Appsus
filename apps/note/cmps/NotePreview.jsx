const { useState } = React

export function NotePreview({ note }) {

    
    return <article key={note.id} className="note" style={note.style}>
        <DynamicNote
            key={note.id}
            type={note.type}
            info={note.info} />
        {/* <input onChange={onChaneBgClr}type="color" /> */}
    </article>
}

function NoteTxt({ info, key }) {
    const { txt } = info

    return <div className="note-content" key={key}>
        <p>{txt}</p>
    </div>
}

function NoteTodos({ info, key }) {
    const { title, todos } = info

    return <div className="note-content" key={key}>
        <h3>{title}</h3>
        {todos.map(todo => {
            return <div key={todo.txt}>
                <input type="checkbox" id={todo.txt} name={todo.txt} />
                <label htmlFor={todo.txt}>{todo.txt}</label>

            </div>
        })}
    </div>
}

function NoteImg({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3>{title}</h3>
        <img src={url} alt="" />
    </div>
}

function NoteVideo({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3>{title}</h3>

        <video controls width="200">
            <source src={url} type="video/webm" />
            <source src={url} type="video/mp4" />
        </video>
    </div>
}

function NoteAudio({ info, key }) {
    const { title, url } = info

    return <div className="note-content" key={key}>
        <h3>{title}</h3>

        <figure>
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