export function NoteInputTxt({ txt, onChangeTxt, key, className, todo }) {

    return <input
        className={className}
        type="text"
        value={txt}
        id={`${key}-txt`}
        name={`${key}-txt`}
        onChange={(ev) => onChangeTxt(ev.target.value,todo)}
        autoFocus={true} />
}