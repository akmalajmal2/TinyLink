import { Router } from 'express';
import { query } from '../db';

const router = Router();

router.get('/:code', async (req, res) => {
  const code = req.params.code;
  if (!code) return res.status(404).send('Not found');

  try {
    const r = await query(
      `UPDATE links
       SET clicks = clicks + 1,
           last_clicked = now()
       WHERE code = $1
       RETURNING target_url`,
      [code]
    );

    if (!r.rowCount) return res.status(404).send('Not found');
    const target = r.rows[0].target_url as string;
    return res.redirect(302, target);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;