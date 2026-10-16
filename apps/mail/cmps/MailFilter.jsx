import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'
import { useIsPhone } from '../custom-hooks/useIsPhone.js'
import { mailService } from '../services/mail.service.js'
import { MailLogo } from './MailLogo.jsx'

const { useState, useEffect } = React

// no props, like the sidebar - it renders on both pages
export function MailFilter() {
    const [searchParams, setParams] = useMailParams()
    const { txt: txtParam } = useMailFilter()
    const isPhone = useIsPhone()
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

    // the sidebar reads this off the url, so the two never have to be wired together.
    // on a phone the nav is a drawer that starts shut, so the flag means the
    // opposite there: 'open' rather than 'rail'
    function onToggleNav() {
        const nav = searchParams.get('nav')

        if (isPhone) setParams({ nav: nav === 'open' ? '' : 'open' })
        else setParams({ nav: nav === 'rail' ? '' : 'rail' })
    }

    return <div className="mail-filter">

        <div className="mail-brand">
            <button
                type="button"
                className="mail-icon-btn"
                title="Main menu"
                aria-expanded={isPhone ? searchParams.get('nav') === 'open' : undefined}
                onClick={onToggleNav}>
                <span className="material-symbols-outlined">menu</span>
            </button>

            <MailLogo />
        </div>

        <div className="mail-search">

            <span className="material-symbols-outlined mail-search-icon">search</span>

            <input
                type="text"
                value={txt}
                placeholder={isPhone ? 'Search in mail' : 'Search mail'}
                className="mail-search-input"
                onChange={ev => setTxt(ev.target.value)} />

            {txt && <button
                type="button"
                className="mail-icon-btn"
                title="Clear search"
                onClick={onClearTxt}>
                <span className="material-symbols-outlined">close</span>
            </button>}

            {/* gmail's phone search bar ends in the account avatar */}
            {isPhone && <span className="mail-account" title={mailService.loggedinUser.email}>
                {mailService.loggedinUser.fullname.charAt(0)}
            </span>}

        </div>
    </div>
}
