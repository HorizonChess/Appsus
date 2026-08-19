import { eventBusService } from '../../../services/event-bus.service.js'

const { useSearchParams } = ReactRouterDOM

// 'subject' is the sprint's "title" - the value matches the mail field so it can
// go straight into the criteria
const SORT_OPTIONS = [
    { value: 'date', label: 'Date' },
    { value: 'subject', label: 'Subject' },
]

// no props, the url carries the sort
export function MailToolbar() {
    const [searchParams, setSearchParams] = useSearchParams()

    const sortBy = searchParams.get('sortBy') || 'date'
    const sortDir = searchParams.get('sortDir') || '-1'

    function setParam(key, value) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set(key, value)
        setSearchParams(nextParams)
    }

    function onSortByChange({ target }) {
        setParam('sortBy', target.value)
    }

    function onToggleSortDir() {
        setParam('sortDir', sortDir === '-1' ? '1' : '-1')
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

            <button className="mail-icon-btn" title="Mark as unread">
                <span className="material-symbols-outlined">mark_email_unread</span>
            </button>

            <button className="mail-icon-btn" title="More">
                <span className="material-symbols-outlined">more_vert</span>
            </button>
        </div>

        <div className="mail-toolbar-sort">
            <label className="mail-sort">
                <span className="mail-sort-label">Sort by</span>

                <select className="mail-sort-select" value={sortBy} onChange={onSortByChange}>
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>

            <button
                className="mail-icon-btn"
                title={sortDir === '-1' ? 'Descending' : 'Ascending'}
                onClick={onToggleSortDir}>
                <span className="material-symbols-outlined">
                    {sortDir === '-1' ? 'arrow_downward' : 'arrow_upward'}
                </span>
            </button>
        </div>

    </div>
}
