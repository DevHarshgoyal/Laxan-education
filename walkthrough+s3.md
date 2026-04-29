# S3 Photo Upload Implementation Walkthrough

We have successfully implemented student photo uploads to AWS S3. The system now captures photos during registration, stores them in the cloud, and displays them on the student dashboard.

## Key Features

### ☁️ Cloud Storage (AWS S3)
- Student photos are uploaded directly to an S3 bucket.
- Files are assigned unique keys using timestamps and random strings to avoid collisions.
- Public read access is enabled for uploaded objects to allow easy rendering in the browser.

### 🗃️ Database Integration
- A new `photo_url` column was added to the `students` table to store the persistent S3 link.
- Registration logic was updated to handle both text data and image files simultaneously.

### 🖼️ UI Rendering
- The **Register Page** now includes a photo upload zone with a live preview.
- The **Profile Card** dynamically fetches and displays the student's photo from S3, with a graceful fallback to a default avatar.

## How to Enable Production Uploads

To start using your actual S3 bucket, update the following values in your backend `.env` file:

```env
AWS_ACCESS_KEY_ID=your_actual_key
AWS_SECRET_ACCESS_KEY=your_actual_secret
AWS_REGION=your_bucket_region
AWS_S3_BUCKET=your_bucket_name
```

## Verification

1. **Register a Student**: Go to `http://localhost:5173/`, upload a photo, and fill in the details.
2. **Check Dashboard**: After registration, you will be redirected to the profile page. The uploaded photo should appear in the profile card.
3. **Inspect Database**: Verify that the `photo_url` column in the `students` table contains a valid S3 URL.
