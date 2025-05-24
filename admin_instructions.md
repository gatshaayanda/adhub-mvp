# AdminHub: User–Profile Sync & Project Assignment

## ✨ Overview

To ensure every client sees their assigned projects immediately (and never gets a blank dashboard), you **must always create a row in the `profiles` table** for each user as soon as they are added to Supabase Auth.

---

## 🚦 Why This Matters

- The `projects` table links each project to a client via `user_id` (the Auth UUID).
- The client dashboard finds projects by filtering with `user_id`.
- If a client does **not** have a matching `profiles` row (with correct `auth_id`), then:
  - Project assignment can fail (user_id = NULL).
  - The client dashboard will show **no projects** even if a project is created for them.

---

## ✅ What To Do (Step-by-Step)

1. **When you register a new user (email) in Supabase Auth:**
   - Immediately create a corresponding row in the `profiles` table with:
     - `auth_id` (from Supabase Auth)
     - `email`
     - `role` (usually `'Client'`)

   Example SQL:
   ```sql
   insert into profiles (auth_id, email, role)
   values ('<SUPABASE_AUTH_ID>', '<user@example.com>', 'Client');
