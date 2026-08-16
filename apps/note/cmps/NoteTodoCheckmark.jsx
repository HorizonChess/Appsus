export function NoteTodoCheckMark({ todo, onChangeTodo, key, className }) {
    return <input
        className={className}
        type="checkbox"
        id={`${key}-check`}
        name={`${key}-check`}
        checked={todo.isDone}
        onChange={() => onChangeTodo(todo)} />
}