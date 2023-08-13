type supermarketType = 'continente' | 'auchan' | 'pingodoce' | 'elcorteingles'

export interface ProductInterface {
    alias: string;
    name: string;
    brand: string;
    image?: string;
    currency?: string;
    currentPrice: string;
    defaultPrice: string;
    isPromo: boolean;
    discount: string;
    productDescription?: string;
    productCategories?: string[];
    packageSize?: string;
    packageUnits?: string;
    wholePrice?: string;
    wholeUnits?: string;
    supermarket: supermarketType;
}

export interface ProductListInterface {
    alias: string;
}