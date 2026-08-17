export function TodosEditor({ info, onChangeVal }) {
    const { todos } = info

    if (!todos) return
    return <div className="note-edit-content">
        <ul className="note-todo-list">
            {todos.map((todo,idx) => {
                return <li key={`note-todo-lis-item-${idx}`}>
                    <input
                        type="text"
                        value={todo.txt}
                        placeholder="Enter task..."
                        className="note-todo-txt"
                        onChange={ev => {
                            todo.txt = ev.target.value
                            onChangeVal({ ...info })
                        }} />

                    <input
                        type="checkbox"
                        checked={todo.isDone}
                        className="note-todo-txt"
                        onChange={ev => {
                            todo.isDone = !todo.isDone
                            onChangeVal({ ...info })
                        }} />

                </li>
            })}
        </ul>
        <button onClick={ev => {
            todos.push({ txt: '', isDone: false })
            onChangeVal({ ...info })
        }}>+</button>
    </div>


}