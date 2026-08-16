export function NoteTitle({note,info,onInputChange}) {

    return <input
        className="add-input title"
        type='text'
        placeholder="Enter Title"
        onChange={(ev) => {

            const newInfo = { ...info, title: ev.target.value }
            onInputChange(note, newInfo)
        }}
        name=""
        id="">

    </input>
}