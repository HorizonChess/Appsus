export function TodosEditor({ info, onChangeVal, isEditMode,noteId }) {
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
                        className="note-todo-checkbox"
                        onChange={ev => {
                            todo.isDone = !todo.isDone
                            onChangeVal({ ...info },noteId)
                        }} />

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
                        onChange={ ev => {
                            todo.isDone = !todo.isDone
                            onChangeVal({ ...info })
                        } } />

                </li>
            })}
        </ul>
        <button onClick={ev => {
            todos.push({ txt: '', isDone: false })
            onChangeVal({ ...info })
        }}>+</button>
    </div>


}