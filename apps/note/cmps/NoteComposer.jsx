import { eventBusService } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
import { AudioEditor } from "./AudioEditor.jsx"
import { TxtEditor } from "./TxtEditor.jsx"
import { TodosEditor } from "./TodosEditor.jsx"
import { TitleEditor } from "./TitleEditor.jsx"
import { ImgEditor } from "./ImgEditor.jsx"

export function NoteComposer({ note, addNote }) {
    const [isPinned, setIsPinned] = useState(false)
    const [draftNote, setDraftNote] = useState({ ...note, type: '' })
    const composerRef = useRef()

    useEffect(() => {
        eventBusService.on('click', (ev) => {
            if (composerRef.current && !composerRef.current.contains(ev.target)) {
                setDraftNote({ ...note, type: '' })
            }
        })
    }, [])

    function handleChange(newInfo) {
        setDraftNote(prev => ({ ...prev, info: newInfo }))
    }

    function onChangeDraftType(type, ev) {
        if (type === 'NoteTodos') {
            setDraftNote(prev => ({ ...prev, type, info: { title: '', todos: [] } }))
        
        } else if ((type) === 'NoteImg') {
            const reader = new FileReader()
            reader.readAsDataURL(ev.target.files[0])
            reader.onload = function (event) {
                const img = new Image()

                img.onload = () => {
                    setDraftNote({ ...draftNote, type: 'NoteImg', info: { ...note.info, url: img.src } })
                }

                img.src = event.target.result
            }
        } else {
            setDraftNote(prev => ({ ...prev, type }))
        }
    }

    function handleTogglePinChange() {
        setIsPinned(!isPinned)
        setDraftNote({ ...draftNote, isPinned: !note.isPinned })
    }

    function onSubmit() {
        addNote(draftNote)
        setDraftNote({ ...note, type: '' })
        setIsPinned(false)
    }


    if (!draftNote.type) {
        return < section className="note-composer collapsed" >
            <h3 className="composer-placeholder"
                onClick={ev => onChangeDraftType('NoteTxt', ev)}>Write a note...</h3>

            <div className="composer-toolbar">
                <button
                    className="toolbar-btn"
                    onClick={ev => onChangeDraftType('NoteTodos')}>
                    <i className="fa-regular fa-square-check"></i>
                </button>

                <input type="file"
                    accept="image/*,.pdf"
                    id="note-img-input"
                    name="note-img-input"
                    className="toolbar-btn" onChange={ev => {
                        ev.preventDefault()
                        onChangeDraftType('NoteImg', ev)
                    }}
                />
                <label className="toolbar-btn" htmlFor="note-img-input"><i class="fa-regular fa-image"></i></label>

                <button
                    className="toolbar-btn"
                    onClick={ev => onChangeDraftType('NoteAudio')}>
                    <i class="fa-solid fa-microphone"></i>
                </button>


            </div>
        </section>
    }


    return < section className="note-composer expanded" ref={composerRef}>
        <TitleEditor info={draftNote.info} onChangeTitle={handleChange} isEditMode={true} />


        <DynamicEditor
            key={`note#${draftNote.id}-editor`}
            cmpType={draftNote.type}
            info={draftNote.info}
            isEditMode={true}
            onChangeVal={handleChange} />


        {isPinned && <button onClick={handleTogglePinChange} className="note-pin pinned">
            <i className="fa-solid fa-thumbtack"></i>

        </button>}
        {!isPinned && <button onClick={handleTogglePinChange} className="note-pin unpinned">
            <i className="fa-solid fa-thumbtack-slash"></i>
        </button>}

        <button className="note-submit-btn" onClick={onSubmit}>
            <i className="fa-solid fa-play"></i>
        </button>

    </section>
}


function DynamicEditor(props) {
    const cmpMap = {
        'NoteTxt': <TxtEditor {...props} />,
        'NoteTodos': <TodosEditor {...props} />,
        'NoteImg': <ImgEditor {...props} />,
        'NoteAudio': <AudioEditor {...props} />

    }
    return cmpMap[props.cmpType]
}