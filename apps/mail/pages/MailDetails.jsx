import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailLabelChip } from '../cmps/MailLabelChip.jsx'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function MailDetails() {
    const [mail, setMail] = useState(null)
    const [siblingIds, setSiblingIds] = useState([])
    const { mailId } = useParams()
    const [searchParams, setParams] = useMailParams()
    const { folder, txt, sortBy, sortDir } = useMailFilter()
    const navigate = useNavigate()

    // prev and next walk the order you came from, and the whole folder rather than
    // the page you happened to open it from. named for the list order, not for
    // dates - sorting by subject makes 'older' meaningless, position never is
    const idx = siblingIds.indexOf(mailId)
    const prevId = idx > 0 ? siblingIds[idx - 1] : null
    const nextId = idx !== -1 && idx < siblingIds.length - 1 ? siblingIds[idx + 1] : null

    // same rule as the list and compose - the mail on screen belongs to the id in
    // the url, so a new id shows the loader rather than the previous mail
    useEffect(() => {
        setMail(null)
        loadMail()
    }, [mailId])

    // only the filter moves these, so stepping through mails does not refetch them
    useEffect(() => {
        loadSiblings()
    }, [folder, txt, sortBy, sortDir])

    function loadSiblings() {
        mailService.query({ folder, txt, sortBy, sortDir })
            .then(mails => setSiblingIds(mails.map(sibling => sibling.id)))
            .catch(err => console.log('Had issues loading the surrounding mails', err))
    }

    // the filter rides along, so the mail you land on keeps the same neighbours
    function onOpenMail(id) {
        navigate(`/mail/${id}?${searchParams}`)
    }

    // opening a mail reads it - the list used to do this on click, but the click
    // no longer knows whether the mail actually opened
    function loadMail() {
        mailService.get(mailId)
            .then(loadedMail => {
                setMail(loadedMail)
                if (!loadedMail.isRead) mailService.toggleRead(mailId, true)
            })
            .catch(err => {
                console.log('Had issues loading mail', err)
                onBack()
            })
    }

    // the folder lives in the query string, so it rides along and comes back
    function onBack() {
        navigate(`/mail?${searchParams}`)
    }

    // compose is a sibling, so the url is the only way to reach it
    function onReply() {
        setParams({ compose: 'new', src: mailId })
    }

    // the note app picks these up off the url. 'txt' and 'type' are its own filter
    // params, so the contract stays clear of both
    function onSaveAsNote() {
        const params = new URLSearchParams({
            addNote: 'NoteTxt',
            title: mail.subject,
            body: mail.body,
        })

        navigate(`/note?${params}`)
    }

    // dropping the last mail off a label is what makes that label stop existing
    function onRemoveLabel(label) {
        setMail(prevMail => ({ ...prevMail, labels: prevMail.labels.filter(name => name !== label) }))

        mailService.removeLabel([mailId], label)
            .catch(err => console.log('Had issues removing label', err))
    }

    function onStarClick() {
        const isStared = !mail.isStared

        setMail(prevMail => ({ ...prevMail, isStared }))

        mailService.toggleStar(mailId, isStared)
            .catch(err => {
                console.log('Had issues starring mail', err)
                setMail(prevMail => ({ ...prevMail, isStared: !isStared }))
            })
    }

    // gmail drops you back to the list when you mark an open mail unread
    function onUnreadClick() {
        mailService.toggleRead(mailId, false)
            .then(onBack)
            .catch(err => console.log('Had issues updating read state', err))
    }

    function onRemoveClick() {
        // trash is the one folder where removing is the second, permanent stage
        const isPermanent = folder === 'trash'

        mailService.remove(mailId)
            .then(() => {
                showSuccessMsg(isPermanent ? 'Conversation deleted forever' : 'Conversation moved to Trash')
                onBack()
            })
            .catch(err => {
                console.log('Had issues removing mail', err)
                showErrorMsg('Could not remove conversation')
            })
    }

    if (!mail) return <section className="mail-index">
        <MailFilter />
        <MailFolderList />
        <main className="mail-content"><div className="loader"></div></main>
    </section>

    const { subject, body, from, fromName, to, isStared } = mail
    const labels = mail.labels || []
    const sentAt = mail.sentAt || mail.createdAt
    const senderName = fromName || from
    const recipient = to === mailService.loggedinUser.email ? 'me' : to

    return <section className="mail-index">

        <MailFilter />

        <MailFolderList />

        <main className="mail-content">
            <section className="mail-details">

                <div className="mail-details-toolbar">
                    <button className="mail-icon-btn" title="Back to list" onClick={onBack}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <button className="mail-icon-btn" title="Delete" onClick={onRemoveClick}>
                        <span className="material-symbols-outlined">delete</span>
                    </button>

                    <button className="mail-icon-btn" title="Mark as unread" onClick={onUnreadClick}>
                        <span className="material-symbols-outlined">mark_email_unread</span>
                    </button>

                    <button
                        className="mail-icon-btn mail-details-prev"
                        title="Previous mail"
                        disabled={!prevId}
                        onClick={() => onOpenMail(prevId)}>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    <button
                        className="mail-icon-btn"
                        title="Next mail"
                        disabled={!nextId}
                        onClick={() => onOpenMail(nextId)}>
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div className="mail-details-subject-line">
                    <h2 className="mail-details-subject">{subject}</h2>

                    {labels.map(label => <MailLabelChip
                        key={label}
                        label={label}
                        onRemove={() => onRemoveLabel(label)} />)}
                </div>

                <header className="mail-details-header">
                    <div className="mail-details-avatar">{senderName.charAt(0).toUpperCase()}</div>

                    <div className="mail-details-from">
                        <div className="mail-details-sender-line">
                            <span className="mail-details-sender">{senderName}</span>
                            <span className="mail-details-address">&lt;{from}&gt;</span>
                        </div>

                        <span className="mail-details-to">to {recipient}</span>
                    </div>

                    <span className="mail-details-date">{mailService.formatMailDate(sentAt)}</span>

                    <button
                        className="mail-icon-btn"
                        title={isStared ? 'Starred' : 'Not starred'}
                        onClick={onStarClick}>
                        <span className={`material-symbols-outlined ${isStared ? 'is-stared' : ''}`}>star</span>
                    </button>

                    <button className="mail-icon-btn" title="Save as note" onClick={onSaveAsNote}>
                        <i className="fa-regular fa-lightbulb"></i>
                    </button>

                    <button className="mail-icon-btn" title="Reply" onClick={onReply}>
                        <span className="material-symbols-outlined">reply</span>
                    </button>
                </header>

                <p className="mail-details-body">{body}</p>

                <footer className="mail-details-reply">
                    <button className="mail-reply-btn" onClick={onReply}>
                        <span className="material-symbols-outlined">reply</span>
                        <span>Reply</span>
                    </button>

                    <button className="mail-reply-btn">
                        <span className="material-symbols-outlined">forward</span>
                        <span>Forward</span>
                    </button>
                </footer>

            </section>
        </main>

        <MailCompose />

    </section>
}
