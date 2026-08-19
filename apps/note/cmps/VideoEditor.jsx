export function VideoEditor({ info, onChangeVal, isEditMode }) {
    return <video controls className="note-video">
            <source src={info.url} type="video/webm" />
            <source src={info.url} type="video/mp4" />
        </video>


}