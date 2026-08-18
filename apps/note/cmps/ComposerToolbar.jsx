export function ComposerToolbar({onChangeNoteType}){
    return <div className="composer-toolbar">
        <button className="toolbar-btn" onClick={ev=>onChangeNoteType('NoteTodos')}><i class="fa-regular fa-square-check"></i></button>
    </div> 
}