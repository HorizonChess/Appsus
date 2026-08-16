import { mailService } from '../services/mail.service.js'
import { MailEditor } from './MailEditor.jsx'

const { useState, useEffect } = React

export function MailCompose({ composeId, prefill, onCloseCompose }) {
    const [mailToEdit, setMailToEdit] = useState(null)

    useEffect(() => {
        loadMail()
    }, [composeId])

    // 'new' builds an empty mail locally, anything else is a draft id to fetch
    function loadMail() {
        if (composeId === 'new') {
            setMailToEdit(mailService.getEmptyMail(prefill))
            return
        }

        mailService.get(composeId)
            .then(setMailToEdit)
            .catch(err => {
                console.log('Had issues loading draft', err)
                onCloseCompose()
            })
    }

    function handleChange({ target }) {
        const { name, value } = target
        setMailToEdit(prevMail => ({ ...prevMail, [name]: value }))
    }

    if (!mailToEdit) return null

    return <form className="mail-compose">

        <header className="mail-compose-header">
            <h3 className="mail-compose-title">New Message</h3>
            <button type="button" className="mail-icon-btn" title="Close" onClick={onCloseCompose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </header>

        <MailEditor mail={mailToEdit} onChange={handleChange} />

        <footer className="mail-compose-footer">
            <button type="submit" className="mail-compose-send">Send</button>
        </footer>

    </form>
}
