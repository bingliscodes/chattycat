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

> **Trade-off worth knowing about.** This policy grants `s3:GetObject` only — not `s3:ListBucket` — so the bucket contents can't be enumerated. But it does mean *anyone with an object's URL* can fetch the file, indefinitely, with no auth check. That's appropriate for avatars and intentionally-public media, and acceptable for a demo project where chat attachments use unguessable keys. For a production deployment where attachments should stay truly private, the cleaner pattern is to keep the bucket fully private (turn all four Block Public Access toggles ON, remove this bucket policy) and have the backend issue short-lived **presigned GET URLs** the same way it already issues presigned PUT URLs for uploads — checking authorization on each request. That prevents exposure from leaked URLs (browser history, referrer headers, accidental copy/paste).

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

## How the pieces fit together: the two-channel model

It's helpful to separate the IAM permission from the presigned URL into two distinct channels:

- **Permission channel (IAM):** long-lived authority. The IAM user's policy grants the backend `s3:PutObject` on this bucket. Set once, lives in AWS, used by every signing operation.
- **Delegation channel (presigned URL):** short-lived, single-purpose proof. Each call to `getSignedUrl` produces a URL that delegates *one specific upload* — one method, one key, one content-type — for a few minutes. The browser uses it once; then it stops working.

The IAM permission is the ceiling. The presigned URL is the precise hole the backend punches in it for one upload.

### What "signing" actually does

The IAM credentials never leave the backend. `getSignedUrl(...)` (called in `uploadController.js:34`) is a pure cryptographic operation — it doesn't talk to AWS. It takes the intended request (method, bucket, key, content-type, expiration) and hashes it with the IAM user's secret key. The signature is appended to the URL as query parameters (`X-Amz-Signature`, `X-Amz-Expires`, etc.).

When the browser later `PUT`s to that URL, S3:

1. Reads the signature off the URL.
2. Recomputes what it should be using its own copy of the IAM user's secret.
3. Verifies the signature matches, the URL hasn't expired, and the request matches the signed intent (right method, right key, right content-type).
4. Verifies the IAM user actually has `s3:PutObject` on that resource.
5. Only then accepts the upload.

### Implications

- The signed URL is **scope-locked.** It only works for `PUT` to that exact key with that exact content-type, for 5 minutes (`expiresIn: 300` in `uploadController.js:34`). It can't be repurposed to upload to a different key, or to `GET` an object.
- A presigned URL **cannot grant more permission than the IAM user has.** If `s3:PutObject` were stripped off the IAM user, every presigned URL in flight would start failing with 403.
- The frontend never holds AWS credentials. The worst a malicious user could do with a leaked presigned URL is upload one file to one already-determined key within 5 minutes, then it stops working.

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
