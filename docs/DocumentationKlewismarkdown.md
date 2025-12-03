SceneIt – Search & Genre Filtering Feature Documentation

Karla Lewis*

This document summarizes the completed work for the Search Filters + Pagination + Backend Integration** feature of the SceneIt group project.

This includes:

 Genre filtering functionality
 Search enhancements (title, year, username)
 Pagination using limit/offset
 Backend `/api/search` route
 TMDB API connections for Trending Shows
 CORS fixes and backend stability improvements
 Frontend + backend integration
 Setup instructions for both environments

---

Tech Stack Used

Frontend

React (Vite)
 React Router
 TailwindCSS
 Components:

   `Search.jsx`
   `GenreFilter.jsx`
   `ShowCard.jsx`
   `TrendingShows.jsx`

###Backend

 Node.js / Express
 Prisma ORM
 Supabase PostgreSQL
 Routes:

   `GET /api/search`

---

##Project Setup Instructions

This section helps anyone set up our project from scratch.

---

##Backend Setup

From the root folder:

```bash
cd backend
npm install
```

###Prisma Setup

Prisma environment variables must be inside:

```
backend/prisma/.env
```

These should include:

```env
DATABASE_URL="YOUR_SUPABASE_POOLED_URL"
DIRECT_URL="YOUR_SUPABASE_DIRECT_5432_URL"
```

Generate Prisma:

```bash
npm run prisma:generate
```

###Start Backend Server**

```bash
npm run dev
```

Backend runs on:

```
http://localhost:8080
```

Test endpoints:

Health check → `http://localhost:8080/health`
Search API → `http://localhost:8080/api/search?limit=20&offset=0`

---

Frontend Setup

From the root folder:

```bash
cd frontend
npm install
```

Create a `.env` file:

Run frontend:

```bash
npm run dev
```

Visit the frontend at:

```
http://localhost:5173
```

---

Search API Documentation

Endpoint

```http
GET /api/search
```

Base URL:

```
http://localhost:8080/api/search
```

Available Query Parameters

| Param               | Type   | Required | Description                            |
| ------------------- | ------ | -------- | -------------------------------------- |
| `q`                 | string | no       | Free‑text search (title / description) |
| `genre`             | string | no       | Genre such as COMEDY, HORROR, DRAMA    |
| `year`              | number | no       | Release year filter                    |
| `username`          | string | no       | Playlist owner filter                  |
| `inPublicPlaylists` | "true" | no       | Public playlist filter                 |
| `limit`             | number | no       | Pagination size (default 20)           |
| `offset`            | number | no       | Pagination offset                      |

Example Request

```
/api/search?genre=COMEDY&limit=20&offset=0
```

Example Response Format

```json
{
  "items": [ ... ],
  "total": 20,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```
Frontend Feature: Search Page

Implemented Features:
 Search bar tied to URL parameters
 Genre dropdown
 Year filter
 Username filter
 Public playlist toggle
 Pagination with limit/offset
 Auto‑updates results when filters change

Key Component Files:

 `src/pages/Search.jsx`
 `src/components/GenreFilter.jsx`
 `src/components/ShowCard.jsx`

---

 Trending Shows (TMDB API)
 Uses TMDB v3 key
 Endpoint used:

```
https://api.themoviedb.org/3/trending/tv/week?api_key=YOUR_KEY
``` Displays trending shows in a carousel
    Renders with `ShowCard` component

CORS & Backend Fixes

To fix frontend → backend communication errors:

```js
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

Added request logger:

```js
app.use((req, _res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});
```

This fixed:

 `CORS policy: No 'Access-Control-Allow-Origin'` errors
 `TypeError: Failed to fetch` on frontend
 Helped debug route issues

Summary of Work Completed by Karla

 Implemented **genre filtering** end‑to‑end
 Added **pagination** using limit/offset
 Fully rebuilt `Search.jsx` to use URL params
 Connected frontend → backend `/api/search`
 Fixed backend **CORS** errors
 Removed dummy backend data
 Helped prepare backend for Prisma + TMDB integration
 Commented codebase for clarity
 Created team documentation for professor review

---
Ready for Submission

This documentation includes:

 Setup instructions ✔️
 API details ✔️
 Technical explanation ✔️
 Team feature summary ✔️
 Ready-to-grade markdown ✔️

