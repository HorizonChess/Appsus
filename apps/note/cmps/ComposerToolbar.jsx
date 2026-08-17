export function ComposerToolbar({onChangeNoteType}){
    return <div>
        <button onClick={ev=>onChangeNoteType('NoteTodos')}>Todos</button>
    </div> 
}