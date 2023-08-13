import axios from 'axios';
import cheerio from 'cheerio';
import calculateDiscount from '../generics/calculateDiscount';
import checkIsPromo from '../generics/checkIsPromo';
import { CURRENCY } from '../../constants/generics';
import { EL_CORTE_INGLES } from '../../constants/supermarkets';

export async function scrapeProductPrice(url: string, alias: string) {
    try {

        /** initial setup */
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const scriptObject = getScriptObject($);
        const auxScriptObject = getAuxScriptObject($);

        /** information */
        const name = scriptObject.product.name;
        const brand = scriptObject.product.brand;
        const image = getImage(auxScriptObject);
        const currency = CURRENCY
        const currentPrice = scriptObject.product.price.final;
        const defaultPrice = getDefaultPrice(scriptObject);
        const isPromo = checkIsPromo(currentPrice, defaultPrice);
        const discount = calculateDiscount(currentPrice, defaultPrice);
        const productDescription = getProductDescription(auxScriptObject)
        const productCategories = scriptObject.product.category
        const { packageSize, packageUnits } = getPackageInformation(scriptObject, name)
        const { wholePrice, wholeUnits } = getWholeInformation($)
        const supermarket = EL_CORTE_INGLES

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
    const scriptContent = $('script:contains("dataLayerContent")').html();
    if (!scriptContent) return {}

    const startIndex = scriptContent.indexOf('dataLayerContent');
    const newScript = scriptContent.slice(startIndex);
    const openObjectIndex = newScript.indexOf('{')
    const closeObjectIndex = newScript.lastIndexOf('}') + 1;
    const objectString = newScript.substring(openObjectIndex, closeObjectIndex);
    const parsedObject = JSON.parse(objectString);
    return parsedObject;
}

const getAuxScriptObject = ($: cheerio.Root) => {
    const scripts = $('script[type="application/ld+json"]');
    let auxScript = ''

    scripts.each((index, element) => {
        const dataHtml = $(element).html();
        const dataObject = JSON.parse(dataHtml as string)

        if (dataObject['@type'] === 'ImageObject') {
            auxScript = dataObject
        }
    })
    return auxScript;
}

const getDefaultPrice = (data: any) => {
    const price = data.product.price.original;
    const finalPrice = data.product.price.final;
    return price || finalPrice;
}

const getImage = (scriptObject: any) => {
    const url = scriptObject.contentUrl
    return `https:${url}`
}

const getProductDescription = (scriptObject: any) => {
    return scriptObject.description
}

const getPackageInformation = (scriptObject: any, name: string) => {
    return {
        packageSize: scriptObject.product.quantity,
        packageUnits: name.slice(-2).trim()
    }
}

const getWholeInformation = ($: cheerio.Root) => {
    const wholeInformation = $('div.prices-price._pum').text().split(' ');
    return {
        wholePrice: wholeInformation[0].slice(1),
        wholeUnits: wholeInformation[wholeInformation.length - 1].slice(0, -1)
    }
}