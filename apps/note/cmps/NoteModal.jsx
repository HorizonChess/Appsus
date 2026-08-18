const { useRef, useEffect } = React

export function NoteModal({ isShown, children, onClose = null }) {
    const dialogRef = useRef(null)

    useEffect(() => {
        if (isShown && dialogRef.current) dialogRef.current.showModal()
        else if (dialogRef.current) dialogRef.current.close()
    }, [isShown])

    function onCloseModal() {
        if (onClose) onClose()
    }

    return (
        <dialog
            closedby="any"
            ref={dialogRef}
            onCancel={onCloseModal}
            className="note-modal">

            {children}
        </dialog>
    )
}
