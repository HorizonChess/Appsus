const { useSearchParams } = ReactRouterDOM

// changing any of these reshuffles the list, so the page you were on is stale
const PAGE_RESET_PARAMS = ['folder', 'txt', 'sortBy', 'sortDir', 'isRead', 'isStared']

export function useMailParams() {
    const [searchParams, setSearchParams] = useSearchParams()

    // every key lands in one write - this router's setter takes a value, not an
    // updater, so a second write would be built from a stale copy and undo the first.
    // falsy deletes, so defaults never reach the url
    function setParams(changes) {
        const nextParams = new URLSearchParams(searchParams)

        Object.entries(changes).forEach(([key, value]) => {
            if (value) nextParams.set(key, value)
            else nextParams.delete(key)

            if (PAGE_RESET_PARAMS.includes(key)) nextParams.delete('pageIdx')
        })

        setSearchParams(nextParams)
    }

    return [searchParams, setParams]
}
