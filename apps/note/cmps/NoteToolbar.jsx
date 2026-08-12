export function NoteToolbar({onOpenModal,onCloseModal}){
    return <div className='note-toolbar'>
        <button onClick={onOpenModal} className="toolbar-btn"><i className="fa-solid fa-palette"></i></button>
    </div>
}