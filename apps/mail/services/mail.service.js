// mail service

import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import { demoMails } from '../data/demo.data.js'


export const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus',
}

// the join key between the sidebar and getFolderCounts, and the sidebar's order
export const MAIL_FOLDERS = ['inbox', 'starred', 'sent', 'draft', 'trash']

// 'subject' is the sprint's "title" - the value doubles as the mail field name
export const SORT_OPTIONS = [
    { value: 'date', label: 'Date' },
    { value: 'subject', label: 'Subject' },
]

// the -1 / 1 _sortMails multiplies by
export const SORT_DIR_OPTIONS = [
    { value: '-1', label: 'Newest' },
    { value: '1', label: 'Oldest' },
]

// gmail's own page size
export const PAGE_SIZE = 50

const MAIL_KEY = 'mailDB'
_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    send,
    toggleStar,
    toggleRead,
    getEmptyMail,
    getReplyPrefill,
    getDefaultFilter,
    getFolderCounts,
    isInFolder,
    formatMailDate,
    loggedinUser,
    MAIL_FOLDERS,
}

window.ms = mailService

function query(filterBy = {}) {
    const criteria = { ...getDefaultFilter(), ...filterBy }

    return storageService.query(MAIL_KEY)
        .then(mails => {
            mails = _filterMails(mails, criteria)
            return _sortMails(mails, criteria.sortBy, criteria.sortDir)
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

// Two stage delete, like gmail:
// first call moves the mail to trash, a second call deletes it for good.
function remove(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => {
            if (mail.removedAt) return storageService.remove(MAIL_KEY, mailId)
            return storageService.put(MAIL_KEY, { ...mail, removedAt: Date.now() })
        })
        .then(_notifyChange)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail).then(_notifyChange)
    } else {
        return storageService.post(MAIL_KEY, mail).then(_notifyChange)
    }
}

function send(mail) {
    return save({
        ...mail,
        from: loggedinUser.email,
        fromName: loggedinUser.fullname,
        sentAt: Date.now(),
        removedAt: null,
        isRead: true,
    })
}

function toggleStar(mailId, isStared) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => storageService.put(MAIL_KEY, { ...mail, isStared }))
        .then(_notifyChange)
}

function toggleRead(mailId, isRead) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => storageService.put(MAIL_KEY, { ...mail, isRead }))
        .then(_notifyChange)
}

// the folder counts live in the sidebar now, which has no way of knowing a write
// happened somewhere else in the app
function _notifyChange(res) {
    eventBusService.emit('mails-changed')
    return res
}

// a mail's folder comes from its fields, it is never stored
function isInFolder(mail, status) {
    const isTrashed = mail.removedAt !== null
    if (status === 'trash') return isTrashed
    if (isTrashed) return false

    const isSent = Boolean(mail.sentAt)

    switch (status) {
        case 'draft': return !isSent
        case 'sent': return isSent && mail.from === loggedinUser.email
        case 'inbox': return isSent && mail.to === loggedinUser.email
        case 'starred': return mail.isStared
        default: return true
    }
}

// Feeds the badges in the folder list: { inbox: { total, unread }, ... }
function getFolderCounts() {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            const counts = {}

            MAIL_FOLDERS.forEach(status => {
                const folderMails = mails.filter(mail => isInFolder(mail,status))
                counts[status] = {
                    total: folderMails.length,
                    unread: folderMails.filter(mail => !mail.isRead).length,
                }
            })

            return counts
        })
}

// no sentAt puts it in Draft; removedAt must be null, not missing
function getEmptyMail({ to = '', subject = '', body = '' } = {}) {
    return {
        to,
        subject,
        body,
        from: loggedinUser.email,
        fromName: loggedinUser.fullname,
        createdAt: Date.now(),
        sentAt: null,
        removedAt: null,
        isRead: true,
        isStared: false,
    }
}

// feeds getEmptyMail, same shape as the note-to-mail prefill
function getReplyPrefill(mail) {
    const sentAt = mail.sentAt || mail.createdAt
    const sender = mail.fromName || mail.from

    return {
        to: mail.from,
        // skipped when it is already a reply, or the prefixes stack
        subject: mail.subject.startsWith('Re: ') ? mail.subject : `Re: ${mail.subject}`,
        body: `\n\nOn ${formatMailDate(sentAt)}, ${sender} <${mail.from}> wrote:\n${mail.body}`,
    }
}

function getDefaultFilter() {
    return {
        status: 'inbox',
        txt: '',
        isRead: null,     // null = show all
        isStared: null,   // null = show all
        from: '',
        subject: '',
        sortBy: 'date',   // date / subject / from
        sortDir: '-1',    // string, like the url always gives. 1 ascending, -1 descending
    }
}

// Gmail's date rule: today -> 14:32, this year -> Sep 12, older -> 12/09/2019
function formatMailDate(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()

    if (date.toDateString() === now.toDateString()) {
        return `${utilService.padNum(date.getHours())}:${utilService.padNum(date.getMinutes())}`
    }

    if (date.getFullYear() === now.getFullYear()) {
        return `${utilService.getMonthName(date).slice(0, 3)} ${date.getDate()}`
    }

    return `${utilService.padNum(date.getDate())}/${utilService.padNum(date.getMonth() + 1)}/${date.getFullYear()}`
}

// ---------------------------------------------------------------- privates

function _filterMails(mails, criteria) {
    mails = mails.filter(mail => isInFolder(mail,criteria.status))

    if (criteria.txt) {
        const txt = criteria.txt.toLowerCase()
        mails = mails.filter(mail => (
            mail.subject.toLowerCase().includes(txt) ||
            mail.body.toLowerCase().includes(txt) ||
            mail.from.toLowerCase().includes(txt) ||
            mail.fromName.toLowerCase().includes(txt) ||
            mail.to.toLowerCase().includes(txt)
        ))
    }

    if (criteria.isRead !== null) {
        mails = mails.filter(mail => mail.isRead === criteria.isRead)
    }

    if (criteria.isStared !== null) {
        mails = mails.filter(mail => mail.isStared === criteria.isStared)
    }

    return mails
}

function _sortMails(mails, sortBy, sortDir) {
    const dir = +sortDir || -1

    return mails.sort((mail1, mail2) => {
        switch (sortBy) {
            case 'subject':
                return mail1.subject.localeCompare(mail2.subject) * dir
            case 'from':
                return (mail1.fromName || mail1.from).localeCompare(mail2.fromName || mail2.from) * dir
            case 'date':
            default:
                return ((mail1.sentAt || mail1.createdAt) - (mail2.sentAt || mail2.createdAt)) * dir
        }
    })
}

function _createMails() {
    const mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        utilService.saveToStorage(MAIL_KEY, demoMails)
    }
}