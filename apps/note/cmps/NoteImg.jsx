export function NoteImg({ info }) {
    const reader = new FileReader()

    reader.onload = function (event) {
        const img = new Image()
        img.onload = () => {
            onInputChange(emptyNoteToEdit, newInfo)
        }
        img.src = event.target.result
    }

    return <div className="add-img">
        <img src={info.url} alt="" />

    </div>
}