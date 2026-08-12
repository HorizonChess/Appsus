// mail service

import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { demoMails } from '../data/demo.data.js'


export const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus',
}

export const MAIL_LABELS = ['critical', 'family', 'work', 'friends', 'spam', 'memories', 'romantic']

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
    getDefaultFilter,
    getFolderCounts,
    formatMailDate,
    loggedinUser,
    MAIL_LABELS,
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
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        return storageService.post(MAIL_KEY, mail)
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

function toggleStar(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => storageService.put(MAIL_KEY, { ...mail, isStared: !mail.isStared }))
}

function toggleRead(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => storageService.put(MAIL_KEY, { ...mail, isRead: !mail.isRead }))
}

// Feeds the badges in the folder list: { inbox: { total, unread }, ... }
function getFolderCounts() {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            const counts = {}
            const folders = ['inbox', 'starred', 'sent', 'draft', 'trash']

            folders.forEach(status => {
                const folderMails = mails.filter(mail => _isInFolder(mail, status))
                counts[status] = {
                    total: folderMails.length,
                    unread: folderMails.filter(mail => !mail.isRead).length,
                }
            })

            return counts
        })
}

function getEmptyMail(subject = '', body = '') {
    return { subject, body }
}

function getDefaultFilter() {
    return {
        status: 'inbox',
        txt: '',
        isRead: null,     // null = show all
        isStared: null,   // null = show all
        labels: [],
        from: '',
        subject: '',
        sortBy: 'date',   // date / subject / from
        sortDir: -1,      // 1 = ascending, -1 = descending (newest first)
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

// inbox / sent / draft / trash are exclusive - a mail is in exactly one of them,
// starred is not exclusive, it is a view over the others, so a starred inbox
// mail correctly shows up in both.
function _isInFolder(mail, status) {
    switch (status) {
        case 'trash': return mail.removedAt !== null
        case 'draft': return mail.removedAt === null && !mail.sentAt
        case 'sent': return mail.removedAt === null && !!mail.sentAt && mail.from === loggedinUser.email
        case 'inbox': return mail.removedAt === null && !!mail.sentAt && mail.to === loggedinUser.email
        case 'starred': return mail.removedAt === null && mail.isStared
        case 'all': return mail.removedAt === null
        default: return true
    }
}

function _filterMails(mails, criteria) {
    mails = mails.filter(mail => _isInFolder(mail, criteria.status))

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

    // has ANY of the selected labels
    if (criteria.labels && criteria.labels.length) {
        mails = mails.filter(mail => mail.labels.some(label => criteria.labels.includes(label)))
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