const { createContext, useContext } = React

export const NoteFuncContext = createContext(null)

export function useNoteFunc() {
    const noteFunc = useContext(NoteFuncContext)
    if (!noteFunc) throw new Error('useNoteFunc must be used inside a NoteFuncContext.Provider')
    return noteFunc
}