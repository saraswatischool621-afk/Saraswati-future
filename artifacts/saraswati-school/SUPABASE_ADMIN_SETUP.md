# Supabase admin setup

The school website remains a static Netlify site. Supabase provides only the external login, content records, and public file URLs used by `/admin`.

## 1. Create the Supabase project

Create a Supabase project, open its SQL Editor, and run [`supabase/schema.sql`](./supabase/schema.sql).

The SQL creates:

- `photos` for homepage/gallery images
- `notices` for school updates
- `disclosure_documents` for B and C mandatory-disclosure PDFs
- `staff_roles` for approved Principal/Admin access
- Private storage buckets named `school-photos` and `school-documents`
- Row Level Security and storage policies that issue short-lived signed URLs only for published records while keeping all writes staff-only

## 2. Add staff accounts

In Supabase, open **Authentication → Users** and create the Principal and Admin accounts with email/password. Disable public sign-ups in **Authentication → Providers → Email**.

Copy each user's UUID from the Users list and run an insert like this in the SQL Editor:

```sql
insert into public.staff_roles (user_id, role, display_name)
values
  ('PRINCIPAL-USER-UUID', 'principal', 'Principal'),
  ('ADMIN-USER-UUID', 'admin', 'School Admin');
```

Do not put passwords, service-role keys, or private keys in the website or repository.

## 3. Configure the website

Add these two **public client** values to the Netlify site's environment variables for every deploy context:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Use the project URL and `anon`/publishable key from **Project Settings → API**. Never use the `service_role` key in this frontend.

For local preview, place the same names in `artifacts/saraswati-school/.env.local` without committing that file.

## 4. Publish content

Visit `/admin`, sign in as an approved Principal/Admin user, and manage:

- Gallery images, captions, ordering, and published state
- Notices and their published state
- B/C disclosure PDF records and published state

The public website falls back to the existing bundled school photos and disclosure list if Supabase is not configured or contains no records. Photos and PDFs stay in private buckets; published records receive short-lived signed links when the page loads. A notice appears publicly only after it is published.