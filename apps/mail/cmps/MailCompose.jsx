import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailEditor } from './MailEditor.jsx'

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

// everything compose puts in the url, so closing it can clear the lot
const COMPOSE_PARAMS = ['compose', 'to', 'subject', 'body', 'src']

// self sufficient like the sidebar - both pages render it and it decides for
// itself whether the url says it should be open
export function MailCompose() {
    const [mailToEdit, setMailToEdit] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    // 'new' | a draft id | null when the modal is closed
    const composeId = searchParams.get('compose')
    // the mail being replied to - its presence is what makes this a reply
    const srcId = searchParams.get('src')

    useEffect(() => {
        if (composeId) loadMail()
    }, [composeId, srcId])

    function getPrefill() {
        return {
            to: searchParams.get('to') || '',
            subject: searchParams.get('subject') || '',
            body: searchParams.get('body') || '',
        }
    }

    // the prefill params go too, or reopening compose refills the old values
    function onCloseCompose() {
        const nextParams = new URLSearchParams(searchParams)
        COMPOSE_PARAMS.forEach(param => nextParams.delete(param))
        setSearchParams(nextParams)
    }

    // 'new' builds an empty mail locally, anything else is a draft id to fetch
    function loadMail() {
        if (composeId === 'new') {
            if (srcId) loadReply()
            else setMailToEdit(mailService.getEmptyMail(getPrefill()))
            return
        }

        mailService.get(composeId)
            .then(setMailToEdit)
            .catch(err => {
                console.log('Had issues loading draft', err)
                onCloseCompose()
            })
    }

    // the quote is built here rather than passed through the url - a full mail
    // body would not survive as a query param
    function loadReply() {
        mailService.get(srcId)
            .then(srcMail => setMailToEdit(mailService.getEmptyMail(mailService.getReplyPrefill(srcMail))))
            .catch(err => {
                console.log('Had issues loading the mail to reply to', err)
                onCloseCompose()
            })
    }

    function handleChange({ target }) {
        const { name, value } = target
        setMailToEdit(prevMail => ({ ...prevMail, [name]: value }))
    }

    // close only on success, so a failed send keeps the typed mail
    function onSend(ev) {
        ev.preventDefault()

        mailService.send(mailToEdit)
            .then(() => {
                showSuccessMsg('Message sent')
                onCloseCompose()
            })
            .catch(err => {
                console.log('Had issues sending mail', err)
                showErrorMsg('Could not send message')
            })
    }

    if (!composeId || !mailToEdit) return null

    return <form className="mail-compose" onSubmit={onSend}>

        <header className="mail-compose-header">
            <h3 className="mail-compose-title">{srcId ? 'Reply' : 'New Message'}</h3>
            <button type="button" className="mail-icon-btn" title="Close" onClick={onCloseCompose}>
                <span className="material-symbols-outlined">close</span>
            </button>
        </header>

        <MailEditor mail={mailToEdit} onChange={handleChange} />

        <footer className="mail-compose-footer">
            <button type="submit" className="mail-compose-send">Send</button>
        </footer>

    </form>
}
