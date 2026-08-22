import { mailService, PAGE_SIZE, SORT_DIR_OPTIONS } from '../services/mail.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useKeyListener } from '../custom-hooks/useKeyListener.js'

const { useState } = React

export function MailPager({ total, pageIdx, pageCount }) {
    const [searchParams, setParams] = useMailParams()
    const [isDirMenuOpen, setIsDirMenuOpen] = useState(false)

    useKeyListener('Escape', () => setIsDirMenuOpen(false))

    // the control needs the resolved value, so the service's default stands in
    const sortDir = searchParams.get('sortDir') || mailService.getDefaultFilter().sortDir

    const firstIdx = pageIdx * PAGE_SIZE + 1
    const lastIdx = Math.min(firstIdx + PAGE_SIZE - 1, total)

    function onSetSortDir(value) {
        setIsDirMenuOpen(false)
        setParams({ sortDir: value })
    }

    return <div className="mail-pager">

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

        {isDirMenuOpen && <ul className="mail-menu mail-dir-menu">
            {SORT_DIR_OPTIONS.map(option => (
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
