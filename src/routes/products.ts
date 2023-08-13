import express from 'express';
const router = express.Router();

import { products_list, add_product, add_bulk_products } from '../controllers/products/product';
import { adminAuth, userAuth } from '../controllers/auth/auth';

/** POST new product */
router.post('/', adminAuth, add_product);

/** POST bulk products */
router.post('/add_bulk_products', adminAuth, add_bulk_products);

/** GET list of products */
router.get('/', userAuth, products_list)

export default router;