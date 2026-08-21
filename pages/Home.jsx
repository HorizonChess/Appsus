const { Link } = ReactRouterDOM

const APPS = [
    {
        path: '/mail',
        name: 'MrEmail',
        tagline: 'Read, write and organise your mail.',
        img: 'assets/MrEmail-icon.png',
        tint: 'rgb(211, 227, 253)',
        ink: 'rgb(11, 87, 208)',
    },
    {
        path: '/note',
        name: 'missKeep',
        tagline: 'Keep notes, lists, images and video.',
        icon: 'fa-regular fa-lightbulb',
        tint: 'rgb(254, 239, 195)',
        ink: 'rgb(158, 118, 12)',
    },
    {
        name: 'Coming soon',
        tagline: 'MissBooks lands here.',
        icon: 'fa-solid fa-plus',
        tint: 'rgb(232, 234, 237)',
        ink: 'rgb(95, 99, 104)',
    },
]

function AppCard({ app }) {
    // a live app is a link, a placeholder is not - same markup either way
    const Card = app.path ? Link : 'div'
    const linkProps = app.path ? { to: app.path } : {}

    return <Card
        className={`home-app ${app.path ? '' : 'is-soon'}`}
        style={{ '--app-tint': app.tint, '--app-ink': app.ink }}
        {...linkProps}>

        <span className="home-app-icon">
            {app.img
                ? <img src={app.img} alt="" />
                : <i className={app.icon}></i>}
        </span>

        <h2 className="home-app-name">{app.name}</h2>
        <p className="home-app-tagline">{app.tagline}</p>

    </Card>
}

export function Home() {
    return <section className="home">

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
