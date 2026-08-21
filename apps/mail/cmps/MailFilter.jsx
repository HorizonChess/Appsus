import { useMailParams } from '../custom-hooks/useMailParams.js'

const { useState, useEffect } = React

// no props, like the sidebar - it renders on both pages
export function MailFilter() {
    const [searchParams, setParams] = useMailParams()

    const txtParam = searchParams.get('txt') || ''
    // local state so typing is instant, the url catches up on a pause
    const [txt, setTxt] = useState(txtParam)

    // the url also changes without the input - folder clicks, back button
    useEffect(() => {
        setTxt(txtParam)
    }, [txtParam])

    // an effect, not a stored debounce - that would close over a stale searchParams
    useEffect(() => {
        if (txt === txtParam) return

        const timeoutId = setTimeout(() => setParams({ txt }), 300)
        return () => clearTimeout(timeoutId)
    }, [txt])

    // skips the debounce
    function onClearTxt() {
        setTxt('')
        setParams({ txt: '' })
    }

    return <div className="mail-filter">
        <div className="mail-search">

            <span className="material-symbols-outlined mail-search-icon">search</span>

            <input
                type="text"
                value={txt}
                placeholder="Search mail"
                className="mail-search-input"
                onChange={ev => setTxt(ev.target.value)} />

            {txt && <button
                type="button"
                className="mail-icon-btn"
                title="Clear search"
                onClick={onClearTxt}>
                <span className="material-symbols-outlined">close</span>
            </button>}

        </div>
    </div>
}
