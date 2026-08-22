import { eventBusService } from '../../../services/event-bus.service.js'
import { SORT_OPTIONS } from '../services/mail.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'
import { MailMoveTo } from './MailMoveTo.jsx'
import { MailPager } from './MailPager.jsx'


const CHECK_ICONS = {
    true: 'check_box',
    mixed: 'indeterminate_check_box',
    false: 'check_box_outline_blank',
}


export function MailToolbar({ total, pageIdx, pageCount, pageIds, selectedIds, onSetSelectedIds }) {
    const [, setParams] = useMailParams()
    const { sortBy } = useMailFilter()

    const isAllSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))
    const checkState = isAllSelected ? 'true' : (selectedIds.length > 0 ? 'mixed' : 'false')


    function onSortByChange({ target }) {
        setParams({ sortBy: target.value, sortDir: null })
    }

    // select all covers the page you are looking at, never the whole folder
    function onToggleSelectAll() {
        onSetSelectedIds(isAllSelected ? [] : pageIds)
    }

    // the list and the sidebar counts both listen, so neither needs telling twice
    function onRefresh() {
        eventBusService.emit('mails-changed')
    }

    return <div className="mail-toolbar">

        <div className="mail-toolbar-actions">
            <button
                className="mail-check mail-select-all"
                role="checkbox"
                aria-checked={checkState}
                title="Select all"
                onClick={onToggleSelectAll}>
                <span className="material-symbols-outlined">{CHECK_ICONS[checkState]}</span>
            </button>

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
