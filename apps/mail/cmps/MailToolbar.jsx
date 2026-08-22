import { eventBusService } from '../../../services/event-bus.service.js'
import { mailService, SORT_OPTIONS } from '../services/mail.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { MailMoveTo } from './MailMoveTo.jsx'
import { MailPager } from './MailPager.jsx'

// the sort rides in the url - the folder size is all it needs told. the
// selection cannot, it belongs to the rows on screen, so it comes as a prop
export function MailToolbar({ total, pageIdx, pageCount, pageIds, selectedIds, onSetSelectedIds }) {
    const [searchParams, setParams] = useMailParams()

    const isAllSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))

    // the control needs the resolved value, so the service's default stands in
    const sortBy = searchParams.get('sortBy') || mailService.getDefaultFilter().sortBy

    function onSortByChange({ target }) {
        setParams({ sortBy: target.value })
    }

    // select all covers the page you are looking at, never the whole folder
    function onToggleSelectAll({ target }) {
        onSetSelectedIds(target.checked ? pageIds : [])
    }

    // the list and the sidebar counts both listen, so neither needs telling twice
    function onRefresh() {
        eventBusService.emit('mails-changed')
    }

    return <div className="mail-toolbar">

        <div className="mail-toolbar-actions">
            {/* the half ticked look is a dom property, there is no attribute for it */}
            <input
                type="checkbox"
                className="mail-check mail-select-all"
                title="Select all"
                checked={isAllSelected}
                ref={el => { if (el) el.indeterminate = selectedIds.length > 0 && !isAllSelected }}
                onChange={onToggleSelectAll} />

            <button className="mail-icon-btn mail-icon-btn-sm" title="Select all">
                <span className="material-symbols-outlined">arrow_drop_down</span>
            </button>

            <button className="mail-icon-btn" title="Refresh" onClick={onRefresh}>
                <span className="material-symbols-outlined">refresh</span>
            </button>

            {/* nothing to move until something is ticked, so gmail hides it */}
            {selectedIds.length > 0 && <MailMoveTo
                mailIds={selectedIds}
                onMoved={() => onSetSelectedIds([])} />}

            <button className="mail-icon-btn mail-hide-mobile" title="Mark as unread">
                <span className="material-symbols-outlined">mark_email_unread</span>
            </button>

            <button className="mail-icon-btn mail-hide-mobile" title="More">
                <span className="material-symbols-outlined">more_vert</span>
            </button>
        </div>

        <div className="mail-toolbar-end">

            <label className="mail-sort">
                <span className="mail-sort-label">Sort by</span>

                <select className="mail-sort-select" value={sortBy} onChange={onSortByChange}>
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>

            {total > 0 && <MailPager total={total} pageIdx={pageIdx} pageCount={pageCount} />}

        </div>

    </div>
}
