import { mailService } from '../services/mail.service.js'

const { useState, useEffect } = React

export function MailIndex() {
    const [mails, setMails] = useState(null)

    useEffect(() => {
        loadMails()

        // //test the service from the console
        // mailService.query({ status: 'inbox' }).then(console.table)        // 15
        // mailService.query({ status: 'draft' }).then(console.table)        //  2
        // mailService.query({ status: 'trash' }).then(console.table)        //  2
        // mailService.query({ status: 'inbox', isRead: false }).then(m => console.log(m.length))
        // mailService.getFolderCounts().then(console.log)
        // mailService.query({ status: 'inbox', sortBy: 'subject', sortDir: 1 }).then(console.table)
    }, [])

    function loadMails() {
        mailService.query({ status: 'inbox' })
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    if (!mails) return <section className="container">Loading...</section>

    // Temporary - phase 3 replaces this with MailFolderList + MailList + MailPreview
    return <section className="container">
        <h2>Inbox ({mails.length})</h2>
        <ul>
            {mails.map(mail => <li key={mail.id}>{mail.fromName} - {mail.subject}</li>)}
        </ul>
    </section>
}
