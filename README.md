# Appsus

A single-page app that bundles three small apps behind one header: an email client
modelled on Gmail, a Google Keep-style notes app, and a book shop. Built as a pair
project during the Coding Academy full-stack bootcamp.

**Live app:** https://horizonchess.github.io/Appsus/

## Who built what

- **Mail** (Gmail clone): [@HorizonChess](https://github.com/HorizonChess)
- **Notes** (Keep clone) and **Books**: [@asanir96](https://github.com/asanir96)

## Mail features

- Inbox, Starred, Sent, Drafts and Trash folders, with unread counts
- Compose with auto-saved drafts
- Custom labels: create, apply and filter by them
- Search and filter, pagination, and previous/next navigation inside a message
- Star, mark read or unread, move and delete, with on-screen feedback
- Keyboard shortcuts
- "Save as note" sends an email straight into the Notes app
- Responsive layout for phones

## Tech

React with React Router (hash routing), custom hooks, an event bus for messages
between apps, and localStorage as a mock backend. There is no build step: JSX is
compiled in the browser by Babel, so the files are served as they are.

## Running it locally

Serve the folder with any static server, for example:

```bash
npx serve .
```
