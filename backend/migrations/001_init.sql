CREATE TABLE IF NOT EXISTS links (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  clicks BIGINT DEFAULT 0,
  last_clicked TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS links_code_idx ON links(code);