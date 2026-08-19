const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

// no props, like the sidebar - it renders on both pages
export function MailFilter() {
    const [searchParams, setSearchParams] = useSearchParams()

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

        const timeoutId = setTimeout(() => setParam('txt', txt), 300)
        return () => clearTimeout(timeoutId)
    }, [txt])

    // delete rather than set '' so get() keeps answering null
    function setParam(key, value) {
        const nextParams = new URLSearchParams(searchParams)

        if (value) nextParams.set(key, value)
        else nextParams.delete(key)

        setSearchParams(nextParams)
    }

    // skips the debounce
    function onClearTxt() {
        setTxt('')
        setParam('txt', '')
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
