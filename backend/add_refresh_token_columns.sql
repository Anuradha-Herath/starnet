-- Add refresh token columns to user_auth table if they don't exist

DO $$ 
BEGIN
    -- Check if refresh_token column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_auth' AND column_name='refresh_token') THEN
        ALTER TABLE user_auth ADD COLUMN refresh_token TEXT;
    END IF;

    -- Check if refresh_token_expires_at column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_auth' AND column_name='refresh_token_expires_at') THEN
        ALTER TABLE user_auth ADD COLUMN refresh_token_expires_at TIMESTAMP;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_auth'
ORDER BY ordinal_position;
