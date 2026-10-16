const { Fragment } = React

// the mark and the name - beside the hamburger on a desktop, at the top of the
// drawer on a phone
export function MailLogo() {
    return <Fragment>
        <img className="mail-logo" src="assets/MrEmail-icon.png" alt="" />
        <span className="mail-logo-txt">MrEmail</span>
    </Fragment>
}
