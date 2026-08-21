import { eventBusService } from '../../../services/event-bus.service.js'
import { mailService, PAGE_SIZE, SORT_OPTIONS, SORT_DIR_OPTIONS } from '../services/mail.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useKeyListener } from '../custom-hooks/useKeyListener.js'

const { useState } = React

// the sort and the page ride in the url - the folder size is all it needs told
export function MailToolbar({ total, pageIdx, pageCount }) {
    const [searchParams, setParams] = useMailParams()
    const [isDirMenuOpen, setIsDirMenuOpen] = useState(false)

    useKeyListener('Escape', () => setIsDirMenuOpen(false))

    // the controls need the resolved value, so the service's defaults stand in
    const defaults = mailService.getDefaultFilter()
    const sortBy = searchParams.get('sortBy') || defaults.sortBy
    const sortDir = searchParams.get('sortDir') || defaults.sortDir

    const firstIdx = pageIdx * PAGE_SIZE + 1
    const lastIdx = Math.min(firstIdx + PAGE_SIZE - 1, total)

    function onSortByChange({ target }) {
        setParams({ sortBy: target.value })
    }

    function onSetSortDir(value) {
        setIsDirMenuOpen(false)
        setParams({ sortDir: value })
    }

    // the list and the sidebar counts both listen, so neither needs telling twice
    function onRefresh() {
        eventBusService.emit('mails-changed')
    }

    return <div className="mail-toolbar">

        <div className="mail-toolbar-actions">
            <input type="checkbox" className="mail-select-all" title="Select all" />

            <button className="mail-icon-btn mail-icon-btn-sm" title="Select all">
                <span className="material-symbols-outlined">arrow_drop_down</span>
            </button>

            <button className="mail-icon-btn" title="Refresh" onClick={onRefresh}>
                <span className="material-symbols-outlined">refresh</span>
            </button>

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

            {total > 0 && <div className="mail-pager">
                {/* gmail hangs the date order off the range itself */}
                <button
                    className="mail-pager-range"
                    title="Date order"
                    onClick={() => setIsDirMenuOpen(!isDirMenuOpen)}>
                    {firstIdx.toLocaleString()}–{lastIdx.toLocaleString()} of {total.toLocaleString()}
                </button>

                {/* catches the outside click that closes the menu */}
                {isDirMenuOpen && <div
                    className="mail-menu-backdrop"
                    onClick={() => setIsDirMenuOpen(false)}></div>}

                {isDirMenuOpen && <ul className="mail-dir-menu">
                    {SORT_DIR_OPTIONS.map(option => (
                        <li key={option.value}>
                            <button
                                className="mail-dir-option"
                                disabled={option.value === sortDir}
                                onClick={() => onSetSortDir(option.value)}>
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>}

                <button
                    className="mail-icon-btn"
                    title="Newer"
                    disabled={pageIdx === 0}
                    onClick={() => setParams({ pageIdx: pageIdx - 1 })}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <button
                    className="mail-icon-btn"
                    title="Older"
                    disabled={pageIdx >= pageCount - 1}
                    onClick={() => setParams({ pageIdx: pageIdx + 1 })}>
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>}

        </div>

    </div>
}
