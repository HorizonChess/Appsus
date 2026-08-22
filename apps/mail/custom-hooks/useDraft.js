import { mailService } from '../services/mail.service.js'

const { useEffect, useRef } = React

const AUTOSAVE_INTERVAL = 5000


export function useDraft(composeId, mailToEdit, setMailToEdit) {
   
    const mailRef = useRef(null)
    mailRef.current = mailToEdit

  
    const isSentRef = useRef(false)

    useEffect(() => {
        isSentRef.current = false
        if (!composeId) return

        const intervalId = setInterval(saveDraft, AUTOSAVE_INTERVAL)
        return () => clearInterval(intervalId)
    }, [composeId])

    // an empty form is not a draft worth keeping
    function saveDraft() {
        const mail = mailRef.current
        if (!mail || isSentRef.current) return
        if (!mail.to && !mail.subject && !mail.body) return

        mailService.save(mail)
            .then(savedMail => setMailToEdit(prevMail => ({ ...prevMail, id: savedMail.id })))
            .catch(err => console.log('Had issues saving draft', err))
    }

    function markSent() {
        isSentRef.current = true
    }

    return { saveDraft, markSent }
}
