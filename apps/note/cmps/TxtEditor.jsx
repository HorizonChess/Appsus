export function TxtEditor({ info, onChangeVal }) {

    return <input
        type="text"
        placeholder="Enter text..."
        className="note-txt"
        value={info.txt}
        onChange={ev => onChangeVal({ ...info, txt: ev.target.value })} />
}