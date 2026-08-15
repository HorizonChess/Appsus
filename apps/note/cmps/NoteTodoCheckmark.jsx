export function NoteTodoCheckMark({ todo, onChangeTodo, key }) {
    console.log('todo',todo)
    return <input
        type="checkbox"
        id={`${key}-check`}
        name={`${key}-check`}
        checked={todo.isDone}
        onChange={() => onChangeTodo(todo)} />
}