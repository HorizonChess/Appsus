const { Link } = ReactRouterDOM

// each tile is the app's own mark on its google palette tint - gmail's blue
// container, keep's yellow 100 and green 100. the keep logo and the book glyph
// (material symbols' auto_stories) are google's own files, not redrawn
const APPS = [
    {
        path: '/mail',
        name: 'MrEmail',
        tagline: 'Read, write and organise your mail.',
        img: 'assets/MrEmail-icon.png',
        tint: 'rgb(211, 227, 253)',
    },
    {
        path: '/note',
        name: 'missKeep',
        tagline: 'Keep notes, lists, images and video.',
        img: 'assets/Google_Keep_2020_Logo.svg',
        tint: 'rgb(254, 239, 195)',
    },
    {
        path: '/book',
        name: 'missBooks',
        tagline: 'Browse and review books.',
        img: 'assets/auto_stories.svg',
        tint: 'rgb(206, 234, 214)',
    },
]

function AppCard({ app }) {
    // a live app is a link, a placeholder is not - same markup either way
    const Card = app.path ? Link : 'div'
    const linkProps = app.path ? { to: app.path } : {}

    return <Card
        className={`home-app ${app.path ? '' : 'is-soon'}`}
        style={{ '--app-tint': app.tint }}
        {...linkProps}>

        <span className="home-app-icon">
            <img src={app.img} alt="" />
        </span>

        <h2 className="home-app-name">{app.name}</h2>
        <p className="home-app-tagline">{app.tagline}</p>

    </Card>
}

export function Home() {
    return <section className="page home">

        <header className="home-hero">
            <h1 className="home-title">Appsus</h1>
            <p className="home-subtitle">Everything in one place.</p>
        </header>

        <ul className="home-apps">
            {APPS.map(app => (
                <li key={app.name}>
                    <AppCard app={app} />
                </li>
            ))}
        </ul>

    </section>
}
