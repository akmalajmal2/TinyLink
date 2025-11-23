import { Router } from 'express';
import { query } from '../db';
import validator from 'validator';
import crypto from 'crypto';

const router = Router();

function genCode(n = 6) {
  return crypto.randomBytes(Math.ceil(n * 3 / 4)).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, n);
}

function sanitizeCode(code?: string | null) {
  if (!code) return null;
  return code.trim();
}

// Create link
router.post('/create', async (req, res) => {
  try {
    const { target_url, custom_code } = req.body as { target_url?: string; custom_code?: string };
    if (!target_url || !validator.isURL(target_url, { require_protocol: true })) {
      return res.status(400).json({ error: 'Invalid URL. Include http:// or https://' });
    }

    let code = sanitizeCode(custom_code);
    if (code) {
      if (!/^[A-Za-z0-9\\-_]{2,64}$/.test(code)) {
        return res.status(400).json({ error: 'Custom code must be 2-64 chars, alphanumeric, - or _' });
      }
      const exists = await query('SELECT id FROM links WHERE code = $1', [code]);
      if (exists.rowCount) return res.status(409).json({ error: 'Code already exists' });
    } else {
      let tries = 0;
      do {
        code = genCode(6);
        const r = await query('SELECT id FROM links WHERE code = $1', [code]);
        if (!r.rowCount) break;
        tries++;
      } while (tries < 6);
      if (!code) return res.status(500).json({ error: 'Could not generate code' });
    }

    const inserted = await query(
      'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING id, code, target_url, created_at, clicks, last_clicked',
      [code, target_url]
    );

    res.json({ ok: true, link: inserted.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List (with optional search q)
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (q) {
      const r = await query(
        `SELECT id, code, target_url, clicks, last_clicked, created_at
         FROM links
         WHERE code ILIKE $1 OR target_url ILIKE $1
         ORDER BY created_at DESC
         LIMIT 100`,
        [`%${q}%`]
      );
      return res.json({ links: r.rows });
    }

    const r = await query(
      `SELECT id, code, target_url, clicks, last_clicked, created_at
       FROM links
       ORDER BY created_at DESC
       LIMIT 1000`
    );
    res.json({ links: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete by id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const r = await query('DELETE FROM links WHERE id = $1 RETURNING id, code', [id]);
    if (!r.rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, deleted: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stats by code
router.get('/code/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const r = await query('SELECT id, code, target_url, clicks, last_clicked, created_at FROM links WHERE code = $1', [code]);
    if (!r.rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({ link: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;