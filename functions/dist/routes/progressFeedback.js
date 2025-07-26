import { Router } from 'express';
import openai from '../services/openai.js';
const router = Router();
router.post('/', async (req, res) => {
    const { trend } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a fitness coach.' },
                {
                    role: 'user',
                    content: `Provide short feedback for this progress: ${JSON.stringify(trend)}`,
                },
            ],
        });
        const message = completion.choices[0].message.content;
        res.json({ message });
    }
    catch (error) {
        console.error('feedback error', error);
        res.status(500).json({ error: 'failed to generate feedback' });
    }
});
export default router;
