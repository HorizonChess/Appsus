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

// the -1 / 1 _sortMails multiplies by. one multiplier, but it reads differently
// per field and opens differently too - a date wants the newest end first, text
// wants A. the first entry of a list is that field's default
export const SORT_DIR_OPTIONS = {
    date: [
        { value: '-1', label: 'Newest' },
        { value: '1', label: 'Oldest' },
    ],
    subject: [
        { value: '1', label: 'A-Z' },
        { value: '-1', label: 'Z-A' },
    ],
}

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
    getLabels,
    getLabelName,
    addLabel,
    removeLabel,
    getEmptyMail,
    getReplyPrefill,
    getDraftReplyTo,
    getDefaultFilter,
    getSortDirOptions,
    getDefaultSortDir,
    getFolderCounts,
    isInFolder,
    formatMailDate,
    loggedinUser,
    MAIL_FOLDERS,
}

window.ms = mailService

function query(filterBy = {}) {
    const defaults = getDefaultFilter()
    const criteria = { ...defaults, ...filterBy }

    // the url hands over a null for every param it is not carrying, and a spread
    // lets those nulls overwrite the defaults they were merged onto - so the sort
    // resolves here rather than in the merge. the direction's default depends on
    // the field, which is why getDefaultFilter cannot hold one at all
    const sortBy = criteria.sortBy || defaults.sortBy
    const sortDir = criteria.sortDir || getDefaultSortDir(sortBy)

    return storageService.query(MAIL_KEY)
        .then(mails => {
            mails = _filterMails(mails, criteria)
            return _sortMails(mails, sortBy, sortDir)
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
        .then(_notifyCounts)
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
        .then(_notifyCounts)
}

function toggleRead(mailId, isRead) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => storageService.put(MAIL_KEY, { ...mail, isRead }))
        .then(_notifyCounts)
}

// the whole selection is read and written in one pass - a put per mail would
// have them all patch the same snapshot and lose everything but the last
function addLabel(mailIds, label) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            const updated = mails.map(mail => {
                if (!mailIds.includes(mail.id)) return mail
                const labels = mail.labels || []
                if (labels.includes(label)) return mail
                return { ...mail, labels: [...labels, label] }
            })

            utilService.saveToStorage(MAIL_KEY, updated)
        })
        .then(_notifyChange)
}

// the list of labels is derived, so a label stops existing on its own once the
// last mail carrying it has been stripped here
function removeLabel(mailIds, label) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            const updated = mails.map(mail => {
                if (!mailIds.includes(mail.id)) return mail
                return { ...mail, labels: (mail.labels || []).filter(name => name !== label) }
            })

            utilService.saveToStorage(MAIL_KEY, updated)
        })
        .then(_notifyChange)
}

// the folder counts live in the sidebar now, which has no way of knowing a write
// happened somewhere else in the app.
// two signals, because the list is not always the one that is behind. a star, a
// read or a delete was applied to the row before the write even started, so
// reloading the list over it puts a snapshot from before that click back on
// screen - which is the flicker you get when a second click lands inside the
// first one's storage round trip. those emit counts only, and the sidebar takes
// both because its numbers are stale either way
function _notifyChange(res) {
    eventBusService.emit('mails-changed')
    return res
}

// the row on screen is already right, only the sidebar is behind
function _notifyCounts(res) {
    eventBusService.emit('mail-counts-changed')
    return res
}

// a mail's folder comes from its fields, it is never stored. anything that is
// not one of MAIL_FOLDERS is a label, and a label is a folder as far as gmail
// is concerned - which is what lets ?folder=Work reuse the whole list
function isInFolder(mail, folder) {
    const isTrashed = mail.removedAt !== null
    if (folder === 'trash') return isTrashed
    if (isTrashed) return false

    const isSent = Boolean(mail.sentAt)

    switch (folder) {
        case 'draft': return !isSent
        case 'sent': return isSent && mail.from === loggedinUser.email
        case 'inbox': return isSent && mail.to === loggedinUser.email
        case 'starred': return mail.isStared
        default: return (mail.labels || []).includes(folder)
    }
}

// there is no label entity - the list is whatever the mails carry, the same way
// a folder is whatever a mail's fields add up to
function getLabels() {
    return storageService.query(MAIL_KEY).then(_extractLabels)
}

// 'Friends/Memories' -> 'Memories'. the path only matters where a label is picked
function getLabelName(label) {
    return label.slice(label.lastIndexOf('/') + 1)
}

// Feeds the badges in the folder list: { inbox: { total, unread }, ... }
function getFolderCounts() {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            const counts = {}
            const folders = [...MAIL_FOLDERS, ..._extractLabels(mails)]

            folders.forEach(folder => {
                const folderMails = mails.filter(mail => isInFolder(mail, folder))
                counts[folder] = {
                    total: folderMails.length,
                    unread: folderMails.filter(mail => !mail.isRead).length,
                }
            })

            return counts
        })
}

// no sentAt puts it in Draft; removedAt must be null, not missing
function getEmptyMail({ to = '', subject = '', body = '', replyTo = null } = {}) {
    return {
        to,
        subject,
        body,
        replyTo, // the mail being answered, null when composed from scratch
        from: loggedinUser.email,
        fromName: loggedinUser.fullname,
        createdAt: Date.now(),
        sentAt: null,
        removedAt: null,
        isRead: true,
        isStared: false,
        labels: [],
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
        replyTo: mail.id,
    }
}

// sent and trashed ones are done with, so they never match
function getDraftReplyTo(srcId) {
    return storageService.query(MAIL_KEY)
        .then(mails => mails.find(mail => mail.replyTo === srcId && !mail.sentAt && !mail.removedAt))
}

function getDefaultFilter() {
    return {
        folder: 'inbox',
        txt: '',
        isRead: null,     // null = show all
        isStared: null,   // null = show all
        from: '',
        subject: '',
        sortBy: 'date',   // date / subject / from
        // no sortDir - what it defaults to depends on sortBy, so getDefaultSortDir owns it
    }
}

// falls back to the date pair so an unknown sortBy still has a direction to use
function getSortDirOptions(sortBy) {
    return SORT_DIR_OPTIONS[sortBy] || SORT_DIR_OPTIONS.date
}

// how a field opens before anyone touches the direction control
function getDefaultSortDir(sortBy) {
    return getSortDirOptions(sortBy)[0].value
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

function _extractLabels(mails) {
    const labels = new Set()

    mails.forEach(mail => (mail.labels || []).forEach(label => {
        labels.add(label)
        // a nested label implies its parent, so the tree never has a hole in it
        if (label.includes('/')) labels.add(label.slice(0, label.indexOf('/')))
    }))

    return [...labels].sort((label1, label2) => label1.localeCompare(label2))
}

function _filterMails(mails, criteria) {
    mails = mails.filter(mail => isInFolder(mail, criteria.folder))

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
    // query resolves this per field before we get here, so it is always ±1
    const dir = +sortDir

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