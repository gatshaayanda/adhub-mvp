-- 🔒 AdminHub Production RLS Policies

-- Remove any previous permissive policies
DROP POLICY IF EXISTS "Allow all" ON projects;

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Clients can only read their own projects
CREATE POLICY "Clients: Read Own Projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

-- Admins (with role = 'Admin' in profiles table) have full access
CREATE POLICY "Admins: Full Access"
  ON projects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_id = auth.uid()
        AND profiles.role = 'Admin'
    )
  );
