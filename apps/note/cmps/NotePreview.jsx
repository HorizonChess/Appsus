const { useState } = React

export function NotePreview({ note }) {
    const [style, setStyle] = useState(note.style)

    return <article style={style}>
        <DynamicNote
            type={note.type}
            info={note.info} />
    </article>
}

function NoteTxt({ info }) {
    const { txt } = info
    return <p>{txt}</p>
}


function DynamicNote(props) {
    const cmpMap = {
        'NoteTxt': <NoteTxt {...props} />
    }

    return cmpMap[props.type]
}