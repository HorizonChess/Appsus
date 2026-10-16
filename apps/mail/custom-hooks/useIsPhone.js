const { useState, useEffect } = React

// the same line mail-responsive.css draws for phones - keep the two together
const PHONE_QUERY = '(max-width: 600px)'

// css can restyle the nav into a drawer by itself, but the hamburger has to know
// which job it is doing: collapse to a rail on a desktop, open the drawer on a phone
export function useIsPhone() {
    const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches)

    useEffect(() => {
        const query = window.matchMedia(PHONE_QUERY)

        function onChange(ev) {
            setIsPhone(ev.matches)
        }

        query.addEventListener('change', onChange)
        return () => query.removeEventListener('change', onChange)
    }, [])

    return isPhone
}
