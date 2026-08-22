import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailEditor } from './MailEditor.jsx'
import { useMailParams } from '../custom-hooks/useMailParams.js'

const { useState, useEffect } = React

// self sufficient like the sidebar - both pages render it and it decides for
// itself whether the url says it should be open
export function MailCompose() {
    const [mailToEdit, setMailToEdit] = useState(null)
    const [searchParams, setParams] = useMailParams()

    const composeId = searchParams.get('compose')
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
        setParams({ compose: '', to: '', subject: '', body: '', src: '' })
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
