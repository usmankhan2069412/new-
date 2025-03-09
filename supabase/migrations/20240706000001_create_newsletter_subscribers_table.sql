-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT,
  preferences JSONB DEFAULT '{"new_posts": true}'::JSONB
);

-- Enable row level security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow public read access" ON newsletter_subscribers;
CREATE POLICY "Allow public read access"
  ON newsletter_subscribers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON newsletter_subscribers;
CREATE POLICY "Allow public insert access"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access" ON newsletter_subscribers;
CREATE POLICY "Allow admin full access"
  ON newsletter_subscribers
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE newsletter_subscribers;
