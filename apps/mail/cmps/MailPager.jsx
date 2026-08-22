import { mailService, PAGE_SIZE } from '../services/mail.service.js'
import { useMailParams } from '../custom-hooks/useMailParams.js'
import { useMailFilter } from '../custom-hooks/useMailFilter.js'
import { useMenu } from '../custom-hooks/useMenu.js'
import { MailMenu } from './MailMenu.jsx'

export function MailPager({ total, pageIdx, pageCount }) {
    const [, setParams] = useMailParams()
    const { sortBy, sortDir } = useMailFilter()
    const { isOpen, toggle, close } = useMenu()

    // ordering subjects by 'Newest' would be meaningless, so the options follow
    // the field being sorted
    const dirOptions = mailService.getSortDirOptions(sortBy)

    const firstIdx = pageIdx * PAGE_SIZE + 1
    const lastIdx = Math.min(firstIdx + PAGE_SIZE - 1, total)

    function onSetSortDir(value) {
        close()
        setParams({ sortDir: value })
    }

    return <div className="mail-pager">

        {/* gmail hangs the sort order off the range itself */}
        <button className="mail-pager-range" title="Sort order" onClick={toggle}>
            {firstIdx.toLocaleString()}–{lastIdx.toLocaleString()} of {total.toLocaleString()}
        </button>

        <MailMenu isOpen={isOpen} onClose={close}>
            <ul className="mail-menu mail-dir-menu">
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
            </ul>
        </MailMenu>

        <button
            className="mail-icon-btn"
            title="Previous page"
            disabled={pageIdx === 0}
            onClick={() => setParams({ pageIdx: pageIdx - 1 })}>
            <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <button
            className="mail-icon-btn"
            title="Next page"
            disabled={pageIdx >= pageCount - 1}
            onClick={() => setParams({ pageIdx: pageIdx + 1 })}>
            <span className="material-symbols-outlined">chevron_right</span>
        </button>

    </div>
}
