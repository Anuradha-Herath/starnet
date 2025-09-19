-- Create user_auth table for storing password hashes
-- This table stores authentication data separately from user profile data

CREATE TABLE user_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_auth_user_id ON user_auth(user_id);

-- Create unique constraint to ensure one auth record per user
CREATE UNIQUE INDEX idx_user_auth_user_id_unique ON user_auth(user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_auth_updated_at
    BEFORE UPDATE ON user_auth
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();