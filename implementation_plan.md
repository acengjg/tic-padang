# Travel Stories Feature Implementation Plan

## Overview
This document outlines the implementation of the "Travel Stories" feature, allowing users to share and view multi-photo/video stories.

## Completed Tasks

### Backend (Node.js + Prisma)
- [x] Create `Story` model in `prisma/schema.prisma`.
- [x] Create `StoryMedia`, `StoryLike`, `StoryComment` models.
- [x] Integrate `multer` for file uploads (`uploads/stories`).
- [x] Implement API endpoints:
  - `POST /api/stories`: Create story with media.
  - `GET /api/stories`: Fetch stories feed.
  - `POST /api/stories/:id/like`: Like story.
  - `POST /api/stories/:id/comments`: Comment on story.

### Frontend (React + TypeScript)
- [x] Create `Story` interface in `types.ts`.
- [x] Create API methods in `client.ts`:
  - `createStory(formData)`
  - `getStories()`
  - `likeStory(id)`
  - `commentStory(id, content)`
- [x] Implement `StoryViewerScreen.tsx`: Full-screen viewer with media, likes, comments.
- [x] Implement `CreateStoryScreen.tsx`: Upload UI with preview, caption, location.
- [x] Integrate `StoriesBar` component into `HomeScreen.tsx`.
- [x] Update `HomeScreen` to fetch and display stories and handle navigation.

## Usage
1. Run backend: `npm run server` (or integrated dev script).
2. Run frontend: `npm run dev`.
3. Navigate to Home Screen to see Stories Bar.
4. Click "Cerita Anda" to upload a story.
5. Click on a story circle to view stories.

## Notes
- Images are served from `http://localhost:3001/uploads/stories/...`.
- Ensure `uploads` directory is writable.
