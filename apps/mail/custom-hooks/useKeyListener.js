const { useRef, useEffect } = React


export function useKeyListener(keys, handler) {
    const handlerRef = useRef(handler)
    handlerRef.current = handler

    useEffect(() => {
        const keyList = Array.isArray(keys) ? keys : [keys]

        function onKeyDown(ev) {
            if (keyList.includes(ev.key)) handlerRef.current(ev)
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])
}
