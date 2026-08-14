export function NoteCheck({isChecked, onInputChange, id}) {
    console.log('NoteCheck-->onInputChange', onInputChange)
    return <input type="checkbox"
        id={id}
        name='isDone'
        value={isChecked}
        onChange={onInputChange} />
}       