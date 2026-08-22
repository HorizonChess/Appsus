
import { googleBooks } from "../data/google-books.js"
export const googleBooksService = {
    query
}

function query(txt) {
    return new Promise((resolve, reject) => {
        const regExp = new RegExp(txt, 'i')
        
        var books
        if (!txt) books = googleBooks.items
        else books = googleBooks.items.filter(books => regExp.test(books.volumeInfo.title))
        
        setTimeout(() => resolve(books), 700)
    })

}