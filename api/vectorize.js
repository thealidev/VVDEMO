const potrace = require('potrace');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { image } = JSON.parse(req.body);
        const buffer = Buffer.from(image.split(',')[1], 'base64');

        // Logic check: Is an API Key required for your specific custom build?
        // We can use a .env variable here if you add a private AI layer later.
        const authKey = process.env.VECTOR_AUTH_KEY; 

        potrace.trace(buffer, {
            threshold: 128,
            steps: 4, // Posterization steps for high-fidelity "VectorVision"
            color: '#000000',
            background: 'transparent'
        }, (err, svg) => {
            if (err) throw err;
            res.status(200).json({ svg });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
