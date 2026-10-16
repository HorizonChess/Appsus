import { useMailParams } from '../custom-hooks/useMailParams.js'

// the one compose button - the sidebar's, and on a phone the one floating over
// the list. compose opens off the url, so neither place has to wire it up
export function MailComposeBtn({ className = '' }) {
    const [, setParams] = useMailParams()

    return <button className={`mail-compose-btn ${className}`} onClick={() => setParams({ compose: 'new' })}>
        <span className="material-symbols-outlined">edit</span>
        <span className="mail-compose-label">Compose</span>
    </button>
}
