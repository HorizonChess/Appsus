const {useRef} =React
export function ImgEditor({ info, onChangeTitle, isEditMode }) {
    const imgRef = useRef()

    return <img ref={imgRef}
        className="note-img"
        src={info.url}
    />
}