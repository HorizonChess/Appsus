import { mailService } from '../services/mail.service.js'

const { useSearchParams } = ReactRouterDOM

export function useMailFilter() {
    const [searchParams] = useSearchParams()
    const defaults = mailService.getDefaultFilter()

    const sortBy = searchParams.get('sortBy') || defaults.sortBy

    return {
        folder: searchParams.get('folder') || defaults.folder,
        txt: searchParams.get('txt') || defaults.txt,
        sortBy,
        // the direction's default depends on the field, so it resolves after it
        sortDir: searchParams.get('sortDir') || mailService.getDefaultSortDir(sortBy),
    }
}
