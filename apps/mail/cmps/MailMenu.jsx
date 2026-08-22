const { Fragment } = React

// the backdrop that catches the outside click, plus whichever card was handed
// in. the card keeps its own tag and class - a menu is a ul, the Move to one is
// a component - so all this owns is the pair of them appearing together
export function MailMenu({ isOpen, onClose, children }) {
    if (!isOpen) return null

    return <Fragment>
        <div className="mail-menu-backdrop" onClick={onClose}></div>
        {children}
    </Fragment>
}
