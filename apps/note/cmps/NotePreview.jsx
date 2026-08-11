const { useState } = React

export function NotePreview({ note }) {

    return <DynamicNote
        key={note.id}
        type={note.type}
        info={note.info} />
}

function NoteTxt({ info, key }) {
    const { txt } = info

    return <div className="note-content" key={key}>
        <p>{txt}</p>
    </div>
}

function NoteTodos({ info, key }) {
    const { title, todos } = info

    return <div  className="note-content" key={key}>
        <h3>{title}</h3>
        {todos.map(todo => {
            return <div key={todo.txt}>
                <input type="checkbox" id={todo.txt} name={todo.txt} />
                <label htmlFor={todo.txt}>{todo.txt}</label>

            </div>
        })}
    </div>
}

function DynamicNote(props) {
    const cmpMap = {
        'NoteTxt': <NoteTxt {...props} />,
        'NoteTodos': <NoteTodos {...props} />
    }

    return cmpMap[props.type]
}