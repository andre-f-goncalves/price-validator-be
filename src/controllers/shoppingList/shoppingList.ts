import User from '../../db/models/users/user';
import ProductList from '../../db/models/products/productList'
import Product from '../../db/models/products/product';

import { ProductListInterface } from '../../db/models/products/product.types';
import type { Controller } from '../types';

import { get_user_by_id } from '../auth/auth';

import { calculateBestBuy } from '../../utils/generics/calculateBestBuy';

export const add_list: Controller = async (req, res, next) => {
    const token = req.headers.authorization
    const { name } = req.body;
    try {
        const id = await get_user_by_id(token as string);
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(500).json({ message: `user id : ${id}` })

        user.shoppingLists.push({ listName: name, listProducts: [] });
        await user.save();
        return res.status(200).json({ user })
    } catch (err) {
        res.status(500).send(err);
    }
}

export const remove_list: Controller = async (req, res, next) => {
    const token = req.headers.authorization
    const { name } = req.body;
    try {
        const id = get_user_by_id(token as string);
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(500).json({ message: 'cant find user' })

        const shoppingLists = user.shoppingLists.filter(ele => ele.listName !== name);
        user.shoppingLists = shoppingLists;
        await user.save();
        return res.status(200).json({ user })
    } catch (err) {
        res.status(500).send(err);
    }
}

export const get_lists: Controller = async (req, res, next) => {
    const token = req.headers.authorization
    try {
        const id = get_user_by_id(token as string);
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(500).json({ message: 'cant find user' })

        return res.status(200).json({ lists: user.shoppingLists })
    } catch (err) {
        res.status(500).send(err);
    }
}

export const add_product: Controller = async (req, res, next) => {
    const token = req.headers.authorization
    const { name, alias } = req.body
    try {
        const id = get_user_by_id(token as string);
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(500).json({ message: 'cant find user' })

        const product = await ProductList.findOne({ alias: alias })
        if (!product) return res.status(500).json({ message: 'cant find product' })

        const filter = { _id: id, 'shoppingLists.listName': name };
        const update = { $push: { 'shoppingLists.$.listProducts': product } };
        const options = { new: true };

        const updatedUser = await User.findOneAndUpdate(filter, update, options);
        return res.status(200).json({ user: updatedUser })
    } catch (err) {
        res.status(500).send(err);
    }
}

export const remove_product: Controller = async (req, res, next) => {
    const token = req.headers.authorization
    const { name, alias } = req.body
    try {
        const id = get_user_by_id(token as string);
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(500).json({ message: 'cant find user' })

        const product = await ProductList.findOne({ alias: alias })
        if (!product) return res.status(500).json({ message: 'cant find product' })

        const filter = { _id: id, 'shoppingLists.listName': name };
        const update = { $pull: { 'shoppingLists.$.listProducts': product } };
        const options = { new: true };

        const updatedUser = await User.findOneAndUpdate(filter, update, options);
        return res.status(200).json({ user: updatedUser })
    } catch (err) {
        res.status(500).send(err);
    }
}

export const calculate_best_buy: Controller = async (req, res, next) => {
    const token = req.headers.authorization
    const { listName } = req.body;
    try {
        const id = get_user_by_id(token as string);
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(500).json({ message: 'cant find user' })

        const list = user.shoppingLists.find(list => list.listName === listName);
        if (!list) return res.status(500).json({ message: 'cant find list' })

        const aliasList = list.listProducts.reduce<ProductListInterface[]>((acc: any[], item) => {
            return [...acc, item.alias];
        }, [])

        const products = await Product.find({ alias: { $in: aliasList } })

        const bestBuy = calculateBestBuy(products);

        return res.status(200).json({ list: bestBuy })
    } catch (err) {
        res.status(500).send(err);
    }
}