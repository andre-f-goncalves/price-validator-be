import axios from 'axios'
import cheerio from 'cheerio';
import calculateDiscount from '../generics/calculateDiscount';
import checkIsPromo from '../generics/checkIsPromo';
import { CURRENCY } from '../../constants/generics';
import { CONTINENTE } from '../../constants/supermarkets';

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
        const productDescription = scriptObject.description
        const productCategories = getProductCategories($)
        const { packageSize, packageUnits } = getPackageInformation($)
        const { wholePrice, wholeUnits } = getWholeInformation($)
        const supermarket = CONTINENTE

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
    const scriptHtml = script.html();
    const scriptObject = JSON.parse(scriptHtml as string);

    return scriptObject
}

const getDefaultPrice = ($: cheerio.Root, currentPrice: string) => {
    const spanStrikeThrough = $('span.strike-through.list.pwc-tile--price-dashed');
    const spanValue = spanStrikeThrough.has('span.value.pwc-tile--price-value');
    const defaultPrice = spanValue.find('span.value.pwc-tile--price-value').attr('content');

    return defaultPrice || currentPrice

}

const getProductCategories = ($: cheerio.Root) => {
    const categories: string[] = [];
    const breadcrumbs = $('li.breadcrumbs-item[itemprop="itemListElement"]');

    breadcrumbs.each((index, element) => {
        const title = $(element).find('a').attr('title') as string;
        if (index) categories.push(title);
    });

    return categories
}

const getPackageInformation = ($: cheerio.Root) => {
    const packageInfo = $('span.ct-pdp--unit.col-pdp--unit').text().trim().split(' ');
    return {
        packageSize: packageInfo[1],
        packageUnits: packageInfo[2]
    }
}

const getWholeInformation = ($: cheerio.Root) => {
    const price = $('div.pwc-tile--price-secondary span.ct-price-value').text().trim().slice(1).replace(',', '.');
    const unit = $('div.pwc-tile--price-secondary span.pwc-m-unit').text().trim().slice(1);
    return {
        wholePrice: price,
        wholeUnits: unit
    }
}