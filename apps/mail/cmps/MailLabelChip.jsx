import { mailService } from '../services/mail.service.js'

// the chip drops the path - 'Friends/Memories' reads as 'Memories' here, the
// full name only matters where a label is picked. no onRemove means read only
export function MailLabelChip({ label, onRemove }) {
    return <span className="mail-chip" title={label}>
        <span className="mail-chip-name">{mailService.getLabelName(label)}</span>

        {onRemove && <button
            className="mail-chip-remove"
            title={`Remove ${label}`}
            onClick={onRemove}>
            <span className="material-symbols-outlined">close</span>
        </button>}
    </span>
}
