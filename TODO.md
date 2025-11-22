# Tasks to Connect Backend to MongoDB via Render and Frontend to Render Backend via Vercel

## Backend
- [ ] Implement MongoDBStorage class in server/storage.ts implementing IStorage interface
  - Use MongoDB Node.js driver to connect using MONGO_URI environment variable
  - Implement getSlides, getSlide, createSlide, checkDuplicates using MongoDB queries
- [ ] Replace export of storage to use MongoDBStorage instance instead of MemStorage

## Frontend
- [ ] Add environment variable support for API base URL: VITE_API_BASE_URL
- [ ] Update fetch calls in client/src/pages/Home.tsx and others to prepend VITE_API_BASE_URL if set
- [ ] Implement fallback to relative URLs if VITE_API_BASE_URL not set

## Deployment & Configuration
- [ ] Set MONGO_URI environment variable on Render backend deployment
- [ ] Set VITE_API_BASE_URL environment variable on Vercel frontend deployment (e.g., https://slides-backend-hu6m.onrender.com)
- [ ] Test backend API endpoints with MongoDB connection
- [ ] Test frontend functionality with new backend API URL configuration
