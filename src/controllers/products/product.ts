import type { Controller } from '../types';
import { delay } from '../../utils/generics/promises';
import scrapper from '../../utils/scrapper';
import Product from '../../db/models/products/product'
import ProductList from '../../db/models/products/productList'
import {
  AUCHAN,
  CONTINENTE,
  PINGO_DOCE,
  EL_CORTE_INGLES
} from '../../constants/supermarkets';

export const products_list: Controller = async (req, res, next) => {
  const products = await Product.find();
  res.json({ products: products });
}

export const add_product: Controller = async (req, res, next) => {
  const { url, alias, supermarket } = req.body;
  const productInformation = await scrapper(url, alias, supermarket);

  const product = new Product(productInformation);
  await product.save()

  const productList = new ProductList({ alias: alias });
  await productList.save()

  res.json({ message: 'product created successfully' });
}

export const add_bulk_products: Controller = async (req, res, next) => {
  const { products } = req.body;
  for (const entry of products) {
    let scrappedProduct, newProduct, productList;

    scrappedProduct = await scrapper(entry.continente, entry.Alias, CONTINENTE)
    newProduct = new Product(scrappedProduct);
    await newProduct.save();

    scrappedProduct = await scrapper(entry.auchan, entry.Alias, AUCHAN)
    newProduct = new Product(scrappedProduct);
    await newProduct.save();

    scrappedProduct = await scrapper(entry.pingodoce, entry.Alias, PINGO_DOCE)
    newProduct = new Product(scrappedProduct);
    await newProduct.save();

    scrappedProduct = await scrapper(entry.elcorteingles, entry.Alias, EL_CORTE_INGLES)
    newProduct = new Product(scrappedProduct);
    await newProduct.save();

    productList = new ProductList({ alias: entry.Alias });
    await productList.save();

    await delay(1000);
  }
  res.json({ message: 'all products have been added successfully' })
}