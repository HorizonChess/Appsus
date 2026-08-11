export const demoNotes = [
    {
        createdAt: 1754812800000,
        type: 'NoteTxt',
        isPinned: true,
        style: { backgroundColor: '#fff475' },
        info: {
            txt: 'Finish my Keep app today!'
        }
    },
    {
        createdAt: 1754726400000,
        type: 'NoteTxt',
        isPinned: false,
        style: { backgroundColor: '#ccff90' },
        info: {
            txt: 'Remember to buy milk, eggs and coffee.'
        }
    },
    {
        createdAt: 1754640000000,
        type: 'NoteTodos',
        isPinned: true,
        style: { backgroundColor: '#ffcc80' },
        info: {
            title: 'Things to do this week',
            todos: [
                { txt: 'Finish React project', isDone: true },
                { txt: 'Practice JavaScript', isDone: false },
                { txt: 'Go to the gym', isDone: false },
                { txt: 'Call Mom', isDone: false }
            ]
        }
    },
    {
        createdAt: 1754553600000,
        type: 'NoteImg',
        isPinned: false,
        style: { backgroundColor: '#f8bbd0' },
        info: {
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            title: 'Summer vacation'
        }
    },
    {
        createdAt: 1754467200000,
        type: 'NoteVideo',
        isPinned: true,
        style: { backgroundColor: '#b3e5fc' },
        info: {
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            title: 'Funny video'
        }
    },
    {
        createdAt: 1754380800000,
        type: 'NoteAudio',
        isPinned: false,
        style: { backgroundColor: '#d7aefb' },
        info: {
            url: 'https://www.w3schools.com/html/horse.mp3',
            title: 'My favorite audio'
        }
    },
    {
        createdAt: 1754294400000,
        type: 'NoteTodos',
        isPinned: false,
        style: { backgroundColor: '#e6ee9c' },
        info: {
            title: 'Shopping list',
            todos: [
                { txt: 'Bread', isDone: true },
                { txt: 'Tomatoes', isDone: true },
                { txt: 'Cheese', isDone: false },
                { txt: 'Chicken', isDone: false },
                { txt: 'Chocolate', isDone: false }
            ]
        }
    },
    {
        createdAt: 1754208000000,
        type: 'NoteTxt',
        isPinned: false,
        style: { backgroundColor: '#ffffff' },
        info: {
            txt: 'A good programmer is not someone who knows everything — it is someone who knows how to find the answer.'
        }
    },
    {
        createdAt: 1754121600000,
        type: 'NoteVideo',
        isPinned: false,
        style: { backgroundColor: '#ff8a80' },
        info: {
            url: 'https://www.w3schools.com/html/movie.mp4',
            title: 'Weekend video'
        }
    },
    {
        createdAt: 1754035200000,
        type: 'NoteAudio',
        isPinned: true,
        style: { backgroundColor: '#80cbc4' },
        info: {
            url: 'https://fileexamples.com/api/download?file=sample_podcast_episode.mp3&type=audio/mpeg',
            title: 'Morning recording'
        }
    }
]