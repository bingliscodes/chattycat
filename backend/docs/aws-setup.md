# AWS Setup for ChattyCat File Uploads

This document records the AWS configuration that makes the presigned-URL upload flow work. The flow lives in:

- Frontend: `chattycat/frontend/src/utils/js/fileUploads.js` — requests presigned URLs, then `PUT`s files directly to S3 from the browser.
- Backend: `chattycat/backend/controllers/uploadController.js` and `chattycat/backend/utils/multerS3.js` — generates the presigned URLs using AWS SDK credentials.

> **No credentials in this file.** Access keys, secret keys, and the AWS account ID live only in `chattycat/backend/config.env` (gitignored) and in AWS itself. This doc only describes the *shape* of the configuration.

---

## Required env vars (set in `backend/config.env`)

| Variable | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key — never commit |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret — never commit |
| `AWS_REGION` | Region the bucket lives in (currently `us-east-1`) |
| `AWS_S3_BUCKET_NAME` | Bucket name (currently `chattycat-user-avatars`) |

---

## S3 bucket configuration

Bucket: `chattycat-user-avatars` · Region: `us-east-1`

### 1. Block Public Access

The two **bucket-policy** toggles are **OFF** so the public-read policy below can take effect. The two **ACL** toggles remain **ON** — we don't use ACLs to grant access, so blocking them costs nothing and adds defense-in-depth.

| Toggle | State | Reason |
|---|---|---|
| Block public access via new ACLs | **ON** | We don't grant access via ACLs |
| Block public access via any ACLs | **ON** | We don't grant access via ACLs |
| Block public access via new bucket policies | **OFF** | Required for the public-read bucket policy to apply |
| Block public/cross-account access via any bucket policies | **OFF** | Required for the public-read bucket policy to apply |

### 2. Bucket policy (public read of objects)

Anyone can `GET` an object — required because uploaded files are served via their plain `https://<bucket>.s3.<region>.amazonaws.com/<key>` URL, which the frontend stores in `MessageAttachment.fileUrl`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::chattycat-user-avatars/*"
    }
  ]
}
```

### 3. CORS configuration

Allows the browser to `PUT` directly to S3 from each frontend origin. Without this the upload fails with a CORS error in the browser console — the request never reaches S3's auth check.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "POST", "DELETE", "PUT"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://chattycat.netlify.app",
      "https://chattycat.onrender.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Only `PUT` is actually used by `fileUploads.js`; the others are harmless extras. Update `AllowedOrigins` whenever the frontend gains a new deploy URL or custom domain.

---

## IAM configuration

An IAM user holds the access key referenced by `AWS_ACCESS_KEY_ID`. It has a single inline policy scoped to exactly what the backend needs — write access to objects in this one bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::chattycat-user-avatars/*"
    }
  ]
}
```

Reads don't need IAM permission — they're handled by the public bucket policy above. If the app ever starts deleting attachments, add `s3:DeleteObject` to the `Action` array.

---

## Setup checklist (for recreating from scratch)

1. Create the S3 bucket in the chosen region.
2. **Permissions → Block public access**: turn off the two bucket-policy toggles (and optionally the two ACL ones).
3. **Permissions → Bucket policy**: paste the JSON in section 2 (replace the bucket name in `Resource`).
4. **Permissions → CORS**: paste the JSON in section 3 (update origins to match your frontend URLs).
5. Create an IAM user, attach the policy in the IAM section (prefer the least-privilege version), generate an access key, paste into `backend/config.env`.
6. Restart the backend so the new env vars load.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Browser logs a CORS error on `PUT` to S3 | Origin missing from CORS `AllowedOrigins` |
| `403 Forbidden` from S3 on `PUT` | IAM user lacks `s3:PutObject`, or presigned URL expired |
| `403 Forbidden` when loading the uploaded file URL | Bucket policy missing or `Block public access` re-enabled the bucket-policy toggles |
| Backend can't sign URLs at all | `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_S3_BUCKET_NAME` missing or wrong in `config.env` |
