const { Link, NavLink } = ReactRouterDOM

const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/mail', label: 'Mail' },
    { to: '/note', label: 'Notes' },
    { to: '/book', label: 'Books' },
    { to: '/about', label: 'About' },
]

// four tiles, one per app colour, so the mark reads as "a set of apps"
function LogoMark() {
    return <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="13" height="13" rx="4" fill="rgb(66, 133, 244)" />
        <rect x="17" y="2" width="13" height="13" rx="6.5" fill="rgb(234, 67, 53)" />
        <rect x="2" y="17" width="13" height="13" rx="6.5" fill="rgb(251, 188, 4)" />
        <rect x="17" y="17" width="13" height="13" rx="4" fill="rgb(52, 168, 83)" />
    </svg>
}

export function AppHeader() {

    return <header className="app-header">
        <Link to="/" className="app-logo" aria-label="Appsus home">
            <LogoMark />
            <span className="logo-word">Apps<span className="logo-word-accent">us</span></span>
        </Link>
        <nav className="app-nav">
            {NAV_LINKS.map(link => (
                <NavLink key={link.to} to={link.to} end={link.end}>{link.label}</NavLink>
            ))}
        </nav>
    </header>
}
