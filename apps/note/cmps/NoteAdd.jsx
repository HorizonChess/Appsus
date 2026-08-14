const { useState, useEffect } = React

export function NoteAdd({ emptyNote, addNote }) {
    const [inputType, setInputType] = useState(null)
    const [emptyNoteToEdit, setEmptyNoteToEdit] = useState(emptyNote)

    useEffect(() => {
        setEmptyNoteToEdit({ ...emptyNoteToEdit, type: inputType })
    }, [inputType])

    function onInputChange(demptyNoteToEdit, newInfo, todo) {

        setEmptyNoteToEdit({ ...emptyNoteToEdit, info: newInfo })
    }

    function onTodoChange(value, todo) {
        const newTodo = { ...todo, txt: +value }
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
                setInputType(null)
                addNote(emptyNoteToEdit)
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
        console.log('newInfo',newInfo)
        onInputChange(emptyNoteToEdit, newInfo)
    }

    function onChangeTodos(info, name, newValue, idx,ev) {

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
        <input
            className="add-input title"
            type='text'
            name='title'
            placeholder="Enter Title"
            onChange={(ev) => onChangeTodos(info, 'title', ev.target.value)}
            id="">

        </input>

        {newTodos.map((todo, idx) => {
            return <div className="todo-list" key={`todo-text-${idx}`}>
                <input
                    className="add-input txt"
                    type='text'
                    placeholder="Enter Text"
                    value={todo.txt}
                    autoFocus={true}
                    name='txt'
                    onChange={ev => onChangeTodos(info, 'txt', ev.target.value, idx)}
                    id={`txt-${idx}`} />


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

    return <div className="add-txt">
        <input
            className="add-input title"
            type='text'
            placeholder="Enter Title"
            onChange={(ev) => {

                const newInfo = { ...info, title: ev.target.value }
                onInputChange(emptyNoteToEdit, newInfo)
            }}
            name=""
            id="">

        </input>

        <input
            className="add-input txt"
            type='text'
            placeholder="Enter Text"
            onChange={(ev) => {
                const newInfo = { ...info, txt: ev.target.value }
                onInputChange(emptyNoteToEdit, newInfo)
            }}
            name=""
            id="">

        </input>
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