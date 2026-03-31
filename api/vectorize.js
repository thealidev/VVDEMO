export default async function handler(req, res) {
    const { image } = JSON.parse(req.body);
    const API_KEY = process.env.CLOUDKEY; // Add this in Vercel Settings

    try {
        const response = await fetch('https://api.cloudconvert.com/v2/jobs', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${API_KEY}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                tasks: {
                    'import-it': { 
                        operation: 'import/base64', 
                        file: image.split(',')[1], 
                        filename: 'input.jpg' 
                    },
                    'convert-it': { 
                        operation: 'convert', 
                        input: 'import-it', 
                        output_format: 'svg',
                        engine: 'potrace', // The Architect's choice
                        engine_version: '1.16'
                    },
                    'export-it': { 
                        operation: 'export/url', 
                        input: 'convert-it' 
                    }
                }
            })
        });

        const data = await response.json();
        res.status(200).json({ jobId: data.data.id });
    } catch (err) {
        res.status(500).json({ error: "Cloud Connection Failed" });
    }
}
