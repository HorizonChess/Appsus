const { useState } = React

export function NotePreview({ note }) {
    const [style, setStyle] = useState(note.style)

    return <article style={style}>
        <DynamicNote
            type={note.type}
            info={note.info} />
    </article>
}

function NoteTxt({ info }) {
    const { txt } = info
    return <p>{txt}</p>
}

function NoteTodos({ info }) {
    const { title, todos } = info

    return <div>
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