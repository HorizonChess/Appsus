const { useRef, useEffect } = React

export function NoteModal({ isShown, children, onClose = null }) {
	const dialogRef = useRef(null)
    console.log(children)
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

                {/* <button 
                    className="btn-close"
                    onClick={onCloseModal}>x</button> */}

                { children }
		</dialog>
	)
}
