const { useState, useRef, useEffect } = React
import { colorOptions } from "../data/note-color-options.js"

export function NotePreview({ note, updateNote }) {
    const dialogRef = useRef()

    const [style, setStyle] = useState(note.style)
    const [isOpen, setIsOpen] = useState(false)
    console.log('style', style)
    useEffect(() => {
        if (isOpen) dialogRef.current.show()
        else dialogRef.current.close()
    }, [isOpen])

    function onChangeStyle({ target }) {
        const newStyle = {
            ...style,
            backgroundColor: target.value
        }

        setStyle(newStyle)
        updateNote({ ...note, style: newStyle })
    }

    function onOpenModal() {
        setIsOpen(true)
    }

    function onCloseModal() {
        setIsOpen(false)
    }

    return <article key={note.id} className="note" style={style} >
        <DynamicNote
            key={note.id}
            type={note.type}
            info={note.info} />

        <button onClick={onOpenModal}></button>

        <dialog className="color-picker" ref={dialogRef} closedby="any" onClose={onCloseModal} key={note.id + 'Dialog'} id={note.id}>
            <form action="">

                {colorOptions.map(option => {
                    return <div key={option + '-' + note.id}>
                        <label
                            className="color-picker-label"
                            htmlFor={`${option}-${note.id}`}
                            style={{ backgroundColor: option }}>
                                {option==='#ffffff'?<span className='picker-option empty'><i className="fa-solid fa-droplet-slash"></i></span>:''}
                                <span className="picker-option">✓</span>
                        </label>


                        <input
                            type="radio"
                            id={`${option}-${note.id}`}
                            name="bg-color-picker"
                            value={option}
                            checked={style.backgroundColor && style.backgroundColor === option}
                            onChange={onChangeStyle}
                        />
                    </div>
                })}
            </form>
        </dialog>
    </article >
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