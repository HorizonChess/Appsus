export function TodosEditor({ info, onChangeVal, isEditMode, noteId }) {
    const { todos } = info

    if (!todos) return

    if (!isEditMode) return <div className="note-edit-content">
        <ul className="note-todo-list">
            {todos.map((todo, idx) => {
                return <li className="note-todo-item" key={`note-todo-lis-item-${idx}`}>
                    <input
                        type="text"
                        value={todo.txt}
                        contentEditable={false}
                        className="note-todo-txt"
                        readOnly={true} />

                    <input
                        type="checkbox"
                        checked={todo.isDone}
                        id={`${noteId}-${idx}-checkbox`}
                        className="note-todo-checkbox"
                        onChange={ev => {
                            todo.isDone = !todo.isDone
                            onChangeVal({ ...info }, noteId)
                        }} />

                    <label
                        htmlFor={`${noteId}-${idx}-checkbox`}
                        style={{ display: `${ todo.isDone ? 'none':'block' }` }}>
                        {/* {todo.isDone ?
                            <i class="fa-regular fa-square-check"></i> :
                            <i class="fa-regular fa-square"></i>} */}
                        {<i class="fa-regular fa-square"></i>}
                    </label>

                    <label
                        htmlFor={`${noteId}-${idx}-checkbox`}
                        style={{ display: `${ todo.isDone ? 'block':'none' }` }}>
                        {/* {todo.isDone ?
                            <i class="fa-regular fa-square-check"></i> :
                            <i class="fa-regular fa-square"></i>} */}
                        { <i class="fa-regular fa-square-check"></i>}
                    </label>


                </li>
            })}
        </ul>
    </div>

    return <div className="note-edit-content">
        <ul className="note-todo-list">
            {todos.map((todo, idx) => {
                return <li className="note-todo-item" key={`note-todo-lis-item-${idx}`}>
                    <input
                        type="text"
                        value={todo.txt}
                        placeholder="Enter task..."
                        className="note-todo-txt"
                        onChange={isEditMode ? ev => {
                            todo.txt = ev.target.value
                            onChangeVal({ ...info })
                        } : ''} />

                    <input
                        type="checkbox"
                        checked={todo.isDone}
                        className="note-todo-checkbox"
                        id={`${noteId}-${idx}-checkbox`}
                        onChange={ev => {
                            todo.isDone = !todo.isDone
                            onChangeVal({ ...info })
                        }} />
                    <label htmlFor={`${noteId}-${idx}-checkbox`}><i class="fa-regular fa-square-check"></i></label>
                </li>
            })}
        </ul>
        <button onClick={ev => {
            todos.push({ txt: '', isDone: false })
            onChangeVal({ ...info })
        }}>+</button>
    </div>


}