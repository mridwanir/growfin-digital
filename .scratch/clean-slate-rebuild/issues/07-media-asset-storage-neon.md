# 07: Media Asset Upload and Deletion via Neon Object Storage

**What to build:** S3-compatible media asset lifecycle management using `@aws-sdk/client-s3` connected to Neon Object Storage, replacing Cloudinary and the legacy Supabase Edge Function with native Next.js API endpoints.

**Blocked by:** 03: Passwordless Authentication Flow with Better Auth, 06: Stateless Subdomain Routing and Storefront Rendering

**Status:** ready-for-agent

- [ ] Configure S3 client using `@aws-sdk/client-s3` connected to Neon Object Storage endpoints
- [ ] Implement authenticated upload API endpoint (`/api/storage/upload`) allowing merchants to upload business logos, product photos, and hero banners
- [ ] Implement authenticated deletion API endpoint (`/api/storage/delete`) that purges previous assets from the S3 bucket upon image replacement or product removal
- [ ] Replace legacy Cloudinary upload widgets and Supabase Edge Function deletion calls across dashboard forms
- [ ] Update storefront and dashboard media components to render uploaded assets using Next.js `<Image />` with automatic optimization
- [ ] Automated integration test: upload a test image file, confirm S3 object persistence, and verify clean deletion from storage
