import { ProductInterface } from "../../db/models/products/product.types"
import { CONTINENTE, AUCHAN, EL_CORTE_INGLES, PINGO_DOCE } from '../../constants/supermarkets'

export const calculateBestBuy = (productsList: ProductInterface[]) => {
    const splittedMySupermarket = splitBySupermarket(productsList);
    const splittedByProduct = splitByProduct(productsList);

    const pricesBySupermarket = calculatePricesBySupermarket(splittedMySupermarket);
    const cheapestProducts = calculateCheapestProducts(splittedByProduct);


    return { pricesBySupermarket, cheapestProducts };
}

const splitBySupermarket = (productsList: ProductInterface[]) => {
    const splitted: Record<string, ProductInterface[]> = {}
    splitted[CONTINENTE] = []
    splitted[AUCHAN] = []
    splitted[EL_CORTE_INGLES] = []
    splitted[PINGO_DOCE] = []

    productsList.forEach(product => {
        splitted[product.supermarket.toLowerCase()].push(product);
    })


    return splitted;
}

const splitByProduct = (productsList: ProductInterface[]) => {
    const splitted: Record<string, ProductInterface[]> = {}

    productsList.forEach(product => {
        if (splitted[product.alias]) {
            splitted[product.alias].push(product)
        } else {
            splitted[product.alias] = []
            splitted[product.alias].push(product);
        }
    })

    return splitted;
}

const calculateCheapestProducts = (products: Record<string, ProductInterface[]>) => {
    const cheapestProducts = []
    for (const product in products) {
        const cheapestProduct = getCheapestProduct(products[product]);
        cheapestProducts.push(cheapestProduct);
    }
    return cheapestProducts;
}

const calculatePricesBySupermarket = (productsBySupermarket: Record<string, ProductInterface[]>) => {
    const pricesBySupermarket: Record<string, number> = {}
    for (const supermarket in productsBySupermarket) {
        const totalPrice = productsBySupermarket[supermarket].reduce<number>((acc, product) => {
            acc += parseFloat(product.currentPrice);
            return acc
        }, 0)
        pricesBySupermarket[supermarket] = parseFloat(totalPrice.toFixed(2));
    }
    return pricesBySupermarket;
}


const getCheapestProduct = (list: ProductInterface[]) => {
    return list.reduce((lowestProduct, product) => {
        const { currentPrice } = product;
        return currentPrice < lowestProduct.currentPrice ? product : lowestProduct;
    });
};