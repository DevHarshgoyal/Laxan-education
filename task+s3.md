# S3 Photo Upload — Task Checklist

## Backend
- [x] Install `@aws-sdk/client-s3` and `multer`
- [x] Add dummy AWS env vars to `.env`
- [x] Create `config/s3.js` — S3Client setup
- [x] Create `middleware/upload.js` — multer memory storage
- [x] Modify `controllers/registrationController.js` — upload to S3, store URL
- [x] Modify `routes/registrationRoutes.js` — add upload middleware
- [x] Modify `models/queries.js` — add `photo_url` to getProfile query
- [x] Run ALTER TABLE migration — add `photo_url` column to students

## Frontend
- [x] Modify `api/registration.js` — switch to FormData
- [x] Modify `pages/RegisterPage.jsx` — append photo file to FormData
- [x] Modify `components/ProfileCard.jsx` — use `profile.photo_url` with fallback
