const { useEffect } = React

// lifted from the cars project. the empty deps capture the handler once and never
// refresh it, so it must not read state that changes
export function useKeyListener(keys, handler) {
    function onKeyDown(ev) {
        if (!Array.isArray(keys)) keys = [keys]
        if (keys.includes(ev.key)) handler(ev)
    }

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])
}
