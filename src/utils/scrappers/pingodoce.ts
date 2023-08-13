import axios from 'axios'
import calculateDiscount from '../generics/calculateDiscount';
import checkIsPromo from '../generics/checkIsPromo';
import { CURRENCY } from '../../constants/generics';
import { PINGO_DOCE } from '../../constants/supermarkets';


export async function scrapeProductPrice(url: string, alias: string) {
    try {

        /** initial setup */
        const { data } = await axios.get(url);

        /** information */
        const name = data.firstName
        const brand = data.secondName || data.firstName
        const image = getProductImage(data)
        const currency = CURRENCY
        const currentPrice = data.unitPrice.toFixed(2)
        const defaultPrice = data.regularPrice.toString()
        const isPromo = checkIsPromo(currentPrice, defaultPrice)
        const discount = calculateDiscount(currentPrice, defaultPrice)
        const productDescription = data.longDescription
        const productCategories = getProductCategories(data)
        const { packageSize, packageUnits } = getPackageInformation(data.capacity)
        const { wholePrice, wholeUnits } = getWholeInformation(data.unitPrice, data.netContent, data.netContentUnit);
        const supermarket = PINGO_DOCE

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

const getProductCategories = (data: any) => {
    const { categories } = data
    return data.categories.reduce((acc: [], item: any) => {
        return [...acc, item.name]
    }, [])
}

const getProductImage = (data: any) => {
    const baseUrl = 'https://res.cloudinary.com/fonte-online/image/upload/v1/PDO_PROD/'
    const sku = data.sku
    return `${baseUrl}${sku}_1`
}

const getPackageInformation = (data: any) => {
    const packageInformation = data.split(' ')
    return {
        packageSize: packageInformation[0],
        packageUnits: packageInformation[1]
    }
}

const getWholeInformation = (unitPrice: string, netContent: string, netContentUnit: string) => {
    return {
        wholePrice: (Number(unitPrice) / Number(netContent)).toFixed(2),
        wholeUnits: netContentUnit
    }
}