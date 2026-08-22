const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { MailDetails } from './apps/mail/pages/MailDetails.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'
import { BookIndex } from './apps/books/pages/BookIndex.jsx'
import { AddBooks } from './apps/books/pages/AddBooks.jsx'
import { BookEdit } from './apps/books/pages/BookEdit.jsx'
import { BookDetails } from './apps/books/pages/BookDetails.jsx'

export function RootCmp() {
    return <Router>
        <section className="root-cmp">
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mail" element={<MailIndex />} />
                <Route path="/mail/:mailId" element={<MailDetails />} />
                <Route path="/note" element={<NoteIndex />} />
                <Route path='/book' element={<BookIndex />}></Route>
                <Route path='/book/add' element={<AddBooks />}></Route>
                <Route path='/book/edit' element={<BookEdit />}></Route>
                <Route path='/book/edit/:bookId' element={<BookEdit />}></Route>
                <Route path='/book/:bookId' element={<BookDetails />}></Route>
            </Routes>
            <UserMsg />
        </section>
    </Router>
}
