import express from 'express';
import {
  getSalesDataController,
  getFilterOptionsController
} from '../controllers/salesController.js';

const router = express.Router();

// Get filter options
router.get('/filters', getFilterOptionsController);

// Get sales data with search, filter, sort, and pagination
router.get('/', getSalesDataController);

export default router;

