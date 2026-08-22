import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailEditor } from './MailEditor.jsx'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useKeyListener } from '../custom-hooks/useKeyListener.js'
import { useDraft } from '../custom-hooks/useDraft.js'

const { useState, useEffect } = React

// self sufficient like the sidebar - both pages render it and it decides for
// itself whether the url says it should be open
export function MailCompose() {
    const [mailToEdit, setMailToEdit] = useState(null)
    const [searchParams, setParams] = useMailParams()

    const composeId = searchParams.get('compose')
    const srcId = searchParams.get('src')

    const { saveDraft, markSent } = useDraft(composeId, mailToEdit, setMailToEdit)

    useKeyListener('Escape', () => { if (composeId) onCloseCompose() })

    // the mail on screen belongs to the id in the url, so it goes the moment that
    // id does - otherwise the draft you just closed sits in the form under the
    // next one for the whole storage round trip, and sends from there
    useEffect(() => {
        setMailToEdit(null)
        if (composeId) loadMail()
    }, [composeId, srcId])

    function getPrefill() {
        return {
            to: searchParams.get('to') || '',
            subject: searchParams.get('subject') || '',
            body: searchParams.get('body') || '',
        }
    }

    // closing keeps what you typed rather than dropping it - the same save the
    // interval does, just without waiting out the rest of the five seconds
    function onCloseCompose() {
        saveDraft()
        closeCompose()
    }

    // the prefill params go too, or reopening compose refills the old values.
    // sending and the load failures come straight here, neither has a draft to keep
    function closeCompose() {
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
                closeCompose()
            })
    }

    // an unfinished reply to the same mail resumes instead of starting a second
    function loadReply() {
        Promise.all([mailService.getDraftReplyTo(srcId), mailService.get(srcId)])
            .then(([draft, srcMail]) => setMailToEdit(
                draft || mailService.getEmptyMail(mailService.getReplyPrefill(srcMail))
            ))
            .catch(err => {
                console.log('Had issues loading the mail to reply to', err)
                closeCompose()
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
                // an autosaved draft carries an id, so send updates that same
                // record rather than leaving a copy behind in Drafts
                markSent()
                showSuccessMsg('Message sent')
                closeCompose()
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
