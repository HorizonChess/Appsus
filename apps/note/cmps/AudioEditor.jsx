const { useState, useRef } = React
export function AudioEditor({ info, onChangeVal, isEditMode }) {
    const [isRecording, setIsRecording] = useState(true)
    const recordBtnRef = useRef()
    const recording = useRef([])
    const audioRecorder = useRef(null)
    var audio

    function handleRecordAudio() {


        navigator.mediaDevices.getUserMedia({ 'audio': true })
            .then(mediaStream => {
                if (!audioRecorder.current) {
                    audioRecorder.current = new MediaRecorder(mediaStream)
                    audioRecorder.current.start()
                }

                audioRecorder.current.onstop = (e) => {
                    audio = document.createElement('audio');
                    audio.controls = true;

                    const blob = new Blob(recording.current, { type: "audio/ogg; codecs=opus" });
                    const reader = new FileReader()

                    reader.onload = () => {
                        onChangeVal({ ...info, url: reader.result })
                        setIsRecording(prev => !prev)
                    }
                    reader.readAsDataURL(blob)
                }

                audioRecorder.current.addEventListener('dataavailable', (ev) => {
                    recording.current.push(ev.data);
                })
            }
            )
    }


    if (isEditMode && isRecording) {
        handleRecordAudio()

        return <button ref={recordBtnRef}
            className="record-btn recording" onClick={ev => {
                audioRecorder.current.stop()
            }}>
            <i className="fa-solid fa-microphone"></i>
        </button>
    }

    return <figure>
        <audio controls >
            <source src={info.url} type="audio/mpeg" />
            <source src={info.url} type="audio/mpeg" />
            <source src={info.url} type={`audio/ogg; codecs="opus"`} />

        </audio>
    </figure>


}