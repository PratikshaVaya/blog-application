# Blog Application

## Overview
This project is a simple **Blog Application** built as part of a frontend take-home assignment.  
The focus of the implementation is **clean architecture, realistic data handling, and modern React practices**, rather than visual complexity.

The application supports full CRUD operations for blogs and is structured to mirror how a production frontend would interact with a backend API.

---

## Features
- View a list of blog posts
- View details of a single blog post
- Create a new blog post
- Edit an existing blog post
- Delete a blog post with confirmation
- Loading skeletons and empty states
- Persistent data using `localStorage`
---

## Tech Stack

- **React** (functional components)
- **TypeScript**
- **React Router v6** for routing
- **TanStack Query (React Query)** for server-state management
- **Tailwind CSS** for styling
- **shadcn/ui** for accessible UI components
- **localStorage** to simulate backend persistence

---

## Why TanStack Query?

Blog data is treated as **server state**, not UI state.

Even without a real backend, TanStack Query is used to model real-world data flow:

- Asynchronous fetching and mutations
- Caching and query invalidation
- Clear handling of loading and error states
- Separation of UI logic from data access

If a real API were introduced, only the service layer would need to change.

---

## Project Structure
src/
components/
BlogCard.tsx
BlogForm.tsx
pages/
BlogList.tsx
BlogDetail.tsx
CreateBlog.tsx
EditBlog.tsx
lib/
blogService.ts
queryClient.ts
App.tsx
main.tsx
index.css


**Design principle:**  
Pages are kept thin and focused on composition and routing.  
All data access is abstracted behind a service layer and handled through TanStack Query.

---

## Data Handling Approach

- Blog operations are implemented as **async functions**
- A small artificial delay is introduced to simulate network latency
- Data is persisted in `localStorage`
- TanStack Query manages:
  - Fetching blog lists and individual blogs
  - Create, update, and delete mutations
  - Query invalidation to keep the UI consistent

This setup closely reflects how a frontend would interact with a real backend API.

---

## UI & Styling

- Tailwind CSS is used for layout, spacing, and typography
- shadcn/ui components are used selectively:
  - Button
  - Card
  - Input
  - Textarea
  - Alert Dialog
  - Skeleton
- The UI is intentionally minimal to prioritize clarity and usability

---


## Routing

| Route | Description |
|------|------------|
| `/blogs` | Blog list page |
| `/blogs/:id` | Blog detail page |
| `/create` | Create a new blog |
| `/edit/:id` | Edit an existing blog |

---

## Trade-offs & Decisions

- **No global state library**: TanStack Query sufficiently handles server state
- **No backend**: localStorage keeps the scope frontend-focused
- **Minimal UI abstraction**: avoids unnecessary complexity
- **Limited validation**: kept simple due to time-boxed nature of the assignment

## Running the Project Locally
```bash
npm install
npm run dev




