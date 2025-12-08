import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to handle array query parameters
// Express by default only keeps the last value for duplicate keys
// This middleware converts duplicate keys to arrays
app.use((req, res, next) => {
  if (req.url && req.url.includes('?')) {
    const queryString = req.url.split('?')[1];
    const pairs = queryString.split('&');
    const params = {};
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=').map(decodeURIComponent);
      if (key) {
        if (params[key]) {
          // Convert to array if it exists
          if (!Array.isArray(params[key])) {
            params[key] = [params[key]];
          }
          params[key].push(value);
        } else {
          params[key] = value;
        }
      }
    });
    
    // Merge with existing query, giving priority to arrays
    req.query = { ...req.query, ...params };
  }
  next();
});

// Routes
app.use('/api/sales', salesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

