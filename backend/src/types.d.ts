export interface LinkRow {
  id: number;
  code: string;
  target_url: string;
  created_at: string;
  clicks: string | number;
  last_clicked: string | null;
}