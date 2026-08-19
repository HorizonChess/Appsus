export function AudioEditor({ info, onChangeVal, isEditMode }) {
    return <figure>
        <audio controls src={info.url}></audio>
    </figure>


}