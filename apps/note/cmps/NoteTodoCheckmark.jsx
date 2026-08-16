export function NoteTodoCheckMark({ todo, onChangeTodo, key, className }) {
    console.log('todo', todo)
    return <input
        className={className}
        type="checkbox"
        id={`${key}-check`}
        name={`${key}-check`}
        checked={todo.isDone}
        onChange={() => onChangeTodo(todo)} />
}