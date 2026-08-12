const { useState, useEffect, useRef } = React
import { colorOptions } from "../data/note-color-options.js"


export function NoteModal({ isOpen, editedNoteId, onCloseModal, note, onChangeStyle }) {
    const dialogRef = useRef()
    const [modalConent, setModalContent] = useState(note)

    useEffect(() => {
        if (isOpen && note.id === editedNoteId) dialogRef.current.show()
        else dialogRef.current.close()
    }, [isOpen, modalConent])

    return <dialog
        className="color-picker"
        ref={dialogRef}
        closedby="any"
        onClose={onCloseModal}
        key={note.id + 'Dialog'}
        id={note.id}>

        <form action="">

            {colorOptions.map(option => {
                return <div key={option + '-' + note.id}>
                    <label
                        className="color-picker-label"
                        htmlFor={`${option}-${note.id}`}
                        style={{ backgroundColor: option }}>
                        {option === '#ffffff' ? <span className='picker-option empty'><i className="fa-solid fa-droplet-slash"></i></span> : ''}
                        <span className="picker-option">✓</span>
                    </label>


                    <input
                        type="radio"
                        id={`${option}-${note.id}`}
                        name="bg-color-picker"
                        value={option}
                        checked={modalConent.style.backgroundColor && modalConent.style.backgroundColor === option}
                        onChange={(ev) => {
                            const newContent = {...modalConent}
                            newContent.style = {...modalConent.style,backgroundColor: option}
                            setModalContent(newContent)
                            onChangeStyle(ev, note)
                        }}
                    />
                </div>
            })}
        </form>
    </dialog>
}