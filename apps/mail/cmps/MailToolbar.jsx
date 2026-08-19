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

    return <div className="mail-toolbar">

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
}
