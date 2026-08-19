 //Compose and reply both render this.
export function MailEditor({ mail, onChange }) {
    const { to, subject, body } = mail

    return <div className="mail-editor">

        <input
            type="email"
            name="to"
            value={to}
            required
            placeholder="To"
            className="mail-editor-field"
            onChange={onChange} />

        <input
            type="text"
            name="subject"
            value={subject}
            placeholder="Subject"
            className="mail-editor-field"
            onChange={onChange} />

        <textarea
            name="body"
            value={body}
            className="mail-editor-body"
            onChange={onChange}></textarea>

    </div>
}
