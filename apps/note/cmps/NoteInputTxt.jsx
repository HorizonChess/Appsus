export function NoteInputTxt({ txt, onChangeTxt, key, className, todo }) {

    return <textarea
        className={className}
        placeholder={className==='note-title'?'Enter title':'Enter text'}
        type="text"
        value={txt}
        id={`${key}-txt`}
        name={`${key}-txt`}
        onChange={(ev) => onChangeTxt(ev.target.value,todo)}
        autoFocus={true} 
       readOnly={onChangeTxt===undefined} />
}