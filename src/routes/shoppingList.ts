import express from 'express';
const router = express.Router();

import { userAuth } from '../controllers/auth/auth'
import {
    add_list,
    remove_list,
    get_lists,
    add_product,
    remove_product,
    calculate_best_buy
} from '../controllers/shoppingList/shoppingList';

/** POST add new list */
router.post('/', userAuth, add_list);

/** DELETE remove a list */
router.delete('/', userAuth, remove_list);

/** GET get all lists from a user */
router.get('/', userAuth, get_lists);

/** PUT add new item to the list */
router.put('/add_product', userAuth, add_product);

/** PUT remove item from the list */
router.put('/remove_product', userAuth, remove_product);

/** POST calculate best buy */
router.post('/calculate_best_buy', userAuth, calculate_best_buy);

export default router;