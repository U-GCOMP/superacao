# Architecture

## Backend interaction

- To validate, send and receive data to/from the backend, always use the DTO described at the monorepo's `shared/`directory

## What goes in App.tsx?

- This is the App wrapper
- It should have only the Providers necessary to run the application

## What goes in each directory?

- Each directory has its own `_what-goes-in-here.md` at the top of the directory

# File naming

- Every file must be named using **kebab casing** (name-of-file.ext), except for React components, as they will follow the React convention and use **Pascal casing** (NameOfFile.tsx)

# Useful documentation

- Vite folder structure: [Creating a Good Folder Structure For Your Vite App - Walt Guevara](https://www.thatsoftwaredude.com/content/14110/creating-a-good-folder-structure-for-your-vite-app)
