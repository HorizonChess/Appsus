import { useKeyListener } from './useKeyListener.js'

const { useState } = React

// every menu in the toolbar is open or it is not, and closes on Escape either
// way - the only thing that differs between them is what hangs off the button
export function useMenu() {
    const [isOpen, setIsOpen] = useState(false)

    useKeyListener('Escape', close)

    function toggle() {
        setIsOpen(prevIsOpen => !prevIsOpen)
    }

    function close() {
        setIsOpen(false)
    }

    return { isOpen, toggle, close }
}
