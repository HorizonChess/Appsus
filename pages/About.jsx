// same shape as the app list on the home page - one entry per person, and the
// tint follows whichever app they built
const TEAM = [
    {
        name: 'Roseman',
        app: 'MrEmail',
        blurb: 'Folders, search, sorting, drafts, compose and a real two-stage trash.',
        img: 'assets/MrEmail-icon.png',
        tint: 'rgb(211, 227, 253)',
        ink: 'rgb(11, 87, 208)',
    },
    {
        name: 'Asaf Nir',
        app: 'missKeep',
        blurb: 'Text, list, image and video notes, with colours, editing and pinning.',
        icon: 'fa-regular fa-lightbulb',
        tint: 'rgb(254, 239, 195)',
        ink: 'rgb(158, 118, 12)',
    },
]

const FEATURES = [
    'Folders, live search and sorting across every view',
    'Pagination that keeps its place in the address bar',
    'Compose, autosaving drafts and a two-stage trash',
    'Text, list, image and video notes, in colour',
    'Everything you write is saved on this device and waiting next time',
]

export function About() {
    return <section className="page about">

        <header className="about-hero">
            <h1 className="about-title">About Appsus</h1>
            <p className="about-lead">
                A working mockup of the utility apps you keep open in a tab all day.
                Mail and notes, rebuilt to look and behave like the real thing, sharing
                one shell and one set of styles.
            </p>
        </header>

        <h2 className="about-heading">What is inside</h2>

        <ul className="about-features">
            {FEATURES.map(feature => (
                <li key={feature}>{feature}</li>
            ))}
        </ul>

        <h2 className="about-heading">Who built what</h2>

        <ul className="about-team">
            {TEAM.map(member => (
                <li key={member.name} className="about-member" style={{ '--app-tint': member.tint, '--app-ink': member.ink }}>

                    <span className="about-member-icon">
                        {member.img
                            ? <img src={member.img} alt="" />
                            : <i className={member.icon}></i>}
                    </span>

                    <div className="about-member-txt">
                        <h3 className="about-member-name">{member.name}</h3>
                        <p className="about-member-app">{member.app}</p>
                        <p className="about-member-blurb">{member.blurb}</p>
                    </div>

                </li>
            ))}
        </ul>

    </section>
}
