import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'sales.db');
const DB_URL = process.env.SQLITE_DB_URL;

const downloadDb = async () => {
    // 1. Check if DB already exists
    if (fs.existsSync(DB_PATH) && fs.statSync(DB_PATH).size > 0) {
        console.log('✅ SQLite database found. Skipping download.');
        return;
    }

    if (!DB_URL) {
        console.error('❌ Error: SQLITE_DB_URL is not set in .env. Cannot download database.');
        // We exit with 0 to allow the app to try starting (maybe it can create a fresh DB or fail gracefully later),
        // but practically it will likely crash if it expects data.
        // However, crashing here protects against starting with no data.
        process.exit(1);
    }

    // 2. Ensure data directory exists
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }

    console.log('⬇️  Database missing. Downloading from S3...');
    console.log(`SOURCE: ${DB_URL}`);
    console.log(`DEST:   ${DB_PATH}`);

    try {
        const res = await fetch(DB_URL);
        if (!res.ok) throw new Error(`Unexpected response ${res.statusText}`);

        const fileStream = fs.createWriteStream(DB_PATH, { flags: 'wx' });

        // For Node.js environments (fetch + streams)
        if (res.body) {
            // Use standard stream piping if available
            // Readable.fromWeb handles web streams in recent Node versions
            const stream = Readable.fromWeb(res.body);
            await finished(stream.pipe(fileStream));
        }

        console.log('✅ Database downloaded successfully!');
    } catch (err) {
        console.error('❌ Failed to download database:', err.message);
        // Remove partial file if it exists
        if (fs.existsSync(DB_PATH)) {
            fs.unlinkSync(DB_PATH);
        }
        process.exit(1);
    }
};

downloadDb();
