import { mailService, PAGE_SIZE } from '../services/mail.service.js'
import { eventBusService, showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailToolbar } from '../cmps/MailToolbar.jsx'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [selectedIds, setSelectedIds] = useState([])
    const [searchParams, setParams] = useMailParams()
    const navigate = useNavigate()

    const { folder, txt, sortBy, sortDir } = useMailFilter()
    // not part of the filter - it survives a reload where the four above reset it
    const pageIdx = +searchParams.get('pageIdx') || 0

    // clamped, so emptying the last page or narrowing the folder cannot strand you
    const pageCount = mails ? Math.max(Math.ceil(mails.length / PAGE_SIZE), 1) : 1
    const pageIdxToShow = Math.min(Math.max(pageIdx, 0), pageCount - 1)
    const pageMails = mails && mails.slice(pageIdxToShow * PAGE_SIZE, (pageIdxToShow + 1) * PAGE_SIZE)

    // a folder switch drops the old rows right away - the loader covers the gap
    useEffect(() => {
        setMails(null)
    }, [folder])

    // the ticks belong to the rows on screen, so anything that changes which
    // rows those are lets them go
    useEffect(() => {
        setSelectedIds([])
    }, [folder, txt, pageIdx])

    useEffect(() => {
        loadMails()
        return eventBusService.on('mails-changed', loadMails)
    }, [folder, txt, sortBy, sortDir])

    function loadMails() {
        mailService.query({ folder, txt, sortBy, sortDir })
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    function onToggleStar(mailId) {
        const prevMails = mails
        const isStared = !mails.find(mail => mail.id === mailId).isStared

        applyChange(mailId, { isStared })

        mailService.toggleStar(mailId, isStared)
            .catch(err => {
                console.log('Had issues starring mail', err)
                setMails(prevMails)
            })
    }

    function applyChange(mailId, changes) {
        setMails(mails
            .map(mail => (mail.id === mailId ? { ...mail, ...changes } : mail))
            .filter(mail => mailService.isInFolder(mail, folder)))
    }

    function onToggleSelect(mailId) {
        setSelectedIds(prevIds => prevIds.includes(mailId)
            ? prevIds.filter(id => id !== mailId)
            : [...prevIds, mailId])
    }

    // the folder rides along in the query string so details can hand it back
    // a draft is unfinished, so it opens in the editor rather than as a read mail
    function onClickMail(mailId) {
        const mail = mails.find(currMail => currMail.id === mailId)

        if (mailService.isInFolder(mail, 'draft')) setParams({ compose: mailId })
        else navigate(`/mail/${mailId}?${searchParams}`)
    }

    // the service decides trash-vs-destroy, we just drop it from the current view
    function onRemoveMail(mailId) {
        const prevMails = mails

        setMails(mails.filter(mail => mail.id !== mailId))

        // trash is the one folder where removing is the second, permanent stage
        const isPermanent = folder === 'trash'

        mailService.remove(mailId)
            .then(() => showSuccessMsg(isPermanent ? 'Conversation deleted forever' : 'Conversation moved to Trash'))
            .catch(err => {
                console.log('Had issues removing mail', err)
                showErrorMsg('Could not remove conversation')
                setMails(prevMails)
            })
    }

    function onSetRead(mailId, isRead) {
        const prevMails = mails

        applyChange(mailId, { isRead })

        mailService.toggleRead(mailId, isRead)
            .catch(err => {
                console.log('Had issues updating read state', err)
                setMails(prevMails)
            })
    }

    return <section className="mail-index">

        <MailFilter />

        <MailFolderList />

        <main className="mail-content">
            <MailToolbar
                total={mails ? mails.length : 0}
                pageIdx={pageIdxToShow}
                pageCount={pageCount}
                pageIds={pageMails ? pageMails.map(mail => mail.id) : []}
                selectedIds={selectedIds}
                onSetSelectedIds={setSelectedIds} />

            {!mails && <div className="loader"></div>}

            {mails && <MailList
                mails={pageMails}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onToggleStar={onToggleStar}
                onSetRead={onSetRead}
                onClickMail={onClickMail}
                onRemoveMail={onRemoveMail} />}
        </main>

        <MailCompose />

    </section>
}
