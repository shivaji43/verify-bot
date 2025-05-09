-- Add channel_id column to servers table
ALTER TABLE servers ADD COLUMN channel_id TEXT;

-- Create index for faster lookups
CREATE INDEX servers_channel_id_idx ON servers(channel_id);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;