# BENNY HOMES REALTY

Next.js full-stack real-estate application with PostgreSQL persistence through Prisma, admin sessions, Cloudinary property images, and Resend notifications.

## Backend Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and replace `YOUR-PASSWORD` in both Postgres URLs with the Supabase database password. URL-encode any reserved characters in the password. `DATABASE_URL` uses the shared transaction pooler for app traffic; `DIRECT_URL` uses the session pooler for Prisma migrations. The Supabase API URL and API keys are not a replacement for these database URLs.
3. Set `AUTH_SECRET` to a cryptographically random value of at least 32 bytes and set a unique `DEV_ADMIN_PASSWORD` of at least 12 characters before seeding.
4. Generate the Prisma client and apply the initial schema:

   ```powershell
   npm run prisma:generate
   npx prisma migrate dev --name init
   ```

5. Seed the initial super admin and sample listings:

   ```powershell
   npm run seed
   ```

   The initial admin email is `admin@bennyhomes.com`; use the `DEV_ADMIN_PASSWORD` value you configured. The seed does not print or reset the admin password on later runs.

6. Start the app with `npm run dev`.

For production deployments, set the production environment variables, run `npm run prisma:deploy`, then start the Next.js app. Do not commit `.env` or expose the Supabase secret key, Resend API key, Cloudinary API secret, or `AUTH_SECRET` to browser code.

## GitHub and Vercel Deployment

1. Push the project to a GitHub repository. `.env` files are ignored; `.env.example` is included as a setup template. Review staged files before committing and never force-add `.env`.
2. In Vercel, import the GitHub repository. Vercel detects Next.js and uses `npm run build` automatically.
3. Add these environment variables in Vercel for the Production environment (and Preview if those deployments need the same integrations): `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `ADMIN_NOTIFICATION_EMAIL`.
4. Apply database migrations against the production database with `npm run prisma:deploy` before relying on the deployment. Seed the initial admin separately with `DEV_ADMIN_PASSWORD` set locally to a unique password of at least 12 characters; do not expose this variable to the client.
5. Redeploy after changing Vercel environment variables. Confirm the site, admin login, property images, and form notifications against the production services.

The Supabase client environment variables in `.env.example` are not currently used by the application; PostgreSQL access is through Prisma. Do not add unused Supabase keys to Vercel unless that changes.

## Backend Routes

- `GET /api/properties` lists published properties and accepts `category`, `location`, `q`, `minPrice`, and `maxPrice` filters.
- `GET /api/properties/:id` reads a published property by ID or slug.
- `POST /api/properties`, `PATCH /api/properties/:id`, and `DELETE /api/properties/:id` require an active admin session.
- `POST /api/uploads` uploads a JPEG, PNG, or WebP image to Cloudinary for an active admin.
- `POST /api/inquiries`, `POST /api/viewings`, and `POST /api/contact` validate and persist public form submissions, then send configured email notifications.
- Admin login and logout are handled by the `/admin/login` page and server actions; the dashboard requires an active admin session.
