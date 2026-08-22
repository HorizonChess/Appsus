import { mailService, PAGE_SIZE } from '../services/mail.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useKeyListener } from '../custom-hooks/useKeyListener.js'

const { useState } = React

export function MailPager({ total, pageIdx, pageCount }) {
    const [searchParams, setParams] = useMailParams()
    const [isDirMenuOpen, setIsDirMenuOpen] = useState(false)

    useKeyListener('Escape', () => setIsDirMenuOpen(false))

    // both the options and the default depend on what is being sorted - ordering
    // subjects by 'Newest' would be meaningless, and they open at A, not at Z
    const sortBy = searchParams.get('sortBy') || mailService.getDefaultFilter().sortBy
    const dirOptions = mailService.getSortDirOptions(sortBy)
    const sortDir = searchParams.get('sortDir') || mailService.getDefaultSortDir(sortBy)

    const firstIdx = pageIdx * PAGE_SIZE + 1
    const lastIdx = Math.min(firstIdx + PAGE_SIZE - 1, total)

    function onSetSortDir(value) {
        setIsDirMenuOpen(false)
        setParams({ sortDir: value })
    }

    return <div className="mail-pager">

        {/* gmail hangs the sort order off the range itself */}
        <button
            className="mail-pager-range"
            title="Sort order"
            onClick={() => setIsDirMenuOpen(!isDirMenuOpen)}>
            {firstIdx.toLocaleString()}–{lastIdx.toLocaleString()} of {total.toLocaleString()}
        </button>

        {/* catches the outside click that closes the menu */}
        {isDirMenuOpen && <div
            className="mail-menu-backdrop"
            onClick={() => setIsDirMenuOpen(false)}></div>}

        {isDirMenuOpen && <ul className="mail-menu mail-dir-menu">
            {dirOptions.map(option => (
                <li key={option.value}>
                    <button
                        className="mail-menu-option mail-dir-option"
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

    </div>
}
