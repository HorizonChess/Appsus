export function TodosEditor({ info, onChangeVal }) {
    const { todos } = info

    if (!todos ) return 
    return <ul className="todo-list">
        {todos.map(todo => {
            return <li>
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

}