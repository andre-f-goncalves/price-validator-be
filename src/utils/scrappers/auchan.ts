import axios from 'axios';
import cheerio from 'cheerio';
import calculateDiscount from '../generics/calculateDiscount';
import checkIsPromo from '../generics/checkIsPromo';
import { CURRENCY } from '../../constants/generics';
import { AUCHAN } from '../../constants/supermarkets';

export async function scrapeProductPrice(url: string, alias: string) {
    try {

        /** initial setup */
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const scriptObject = getScriptObject($);

        /** information */
        const name = scriptObject.name
        const brand = scriptObject.brand.name
        const image = scriptObject.image[0]
        const currency = CURRENCY
        const currentPrice = scriptObject.offers.price
        const defaultPrice = getDefaultPrice($, currentPrice)
        const isPromo = checkIsPromo(currentPrice, defaultPrice)
        const discount = calculateDiscount(currentPrice, defaultPrice)
        const productDescription = getProductDescription($)
        const productCategories = getProductCategories($)
        const { packageSize, packageUnits } = getPackageInformation($)
        const { wholePrice, wholeUnits } = getWholeInformation($)
        const supermarket = AUCHAN

        return {
            alias,
            name,
            brand,
            image,
            currency,
            currentPrice,
            defaultPrice,
            isPromo,
            discount,
            productDescription,
            productCategories,
            packageSize,
            packageUnits,
            wholePrice,
            wholeUnits,
            supermarket
        }

    } catch (err) {
    }
}

const getScriptObject = ($: cheerio.Root) => {
    const script = $('script[type="application/ld+json"]');
    const scriptHtml = script.html() as string;
    const scriptObject = JSON.parse(scriptHtml);

    return scriptObject
}

const getDefaultPrice = ($: cheerio.Root, currentPrice: string) => {
    const defaultPriceDiv = $('div.auc-price__stricked');
    const defaultPriceList = defaultPriceDiv.has('span.list');
    const defaultPrice = defaultPriceList.find('span.strike-through.value').attr('content');

    return defaultPrice || currentPrice
}

const getProductDescription = ($: cheerio.Root) => {
    const description = $('div.auc-pdp__marketing-text').text().trim()
    return description
}

const getProductCategories = ($: cheerio.Root) => {
    const categories: string[] = [];
    const breadcrumbs = $('li.breadcrumb-item')

    breadcrumbs.each((index, element) => {
        const text = $(element).find('a').text().trim();
        categories.push(text);
    })

    return categories
}

const getPackageInformation = ($: cheerio.Root) => {
    const packageSizeLI = $('li.attribute-values.auc-pdp-regular')[0]
    const packageInfo = $(packageSizeLI).text().trim().split(' ');
    return {
        packageSize: packageInfo[0],
        packageUnits: packageInfo[1]
    }
}

const getWholeInformation = ($: cheerio.Root) => {
    const wholeInformation = $('span.auc-measures--price-per-unit').text().split(' ');
    return {
        wholePrice: wholeInformation[0],
        wholeUnits: wholeInformation[1].slice(2)
    }
}