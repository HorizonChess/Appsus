const {useRef} =React
export function ImgEditor({ info, onChangeTitle, isEditMode }) {
   console.log('hi')
    const imgRef = useRef()

    // function loadImageFromInput(ev, onImageReady) {
    //     const reader = new FileReader()

    //     // Read and encode the file...
    //     reader.readAsDataURL(ev.target.files[0])

    //     // ...when finished encoding, create an <img /> from it...
    //     reader.onload = function (event) {
    //         const img = new Image()

    //         // ...and when the img is ready, run the callback
    //         img.onload = () => onImageReady(img)
    //         img.src = event.target.result
    //     }
    // }
    // if (isEditMode) {

    // }
    return <img ref={imgRef}
        className="note-img"
        src={info.url}
    />
}