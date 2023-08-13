import {
    CONTINENTE,
    PINGO_DOCE,
    EL_CORTE_INGLES,
    AUCHAN
} from '../constants/supermarkets';
import { scrapeProductPrice as auchanScrapper } from './scrappers/auchan'
import { scrapeProductPrice as continenteScrapper } from './scrappers/continente'
import { scrapeProductPrice as pingodoceScrapper } from './scrappers/pingodoce'
import { scrapeProductPrice as elcorteinglesScrapper } from './scrappers/elcorteingles'

export default async function (url: string, alias: string, supermarket: string) {
    switch (supermarket) {
        case AUCHAN: return auchanScrapper(url, alias);
        case CONTINENTE: return continenteScrapper(url, alias);
        case PINGO_DOCE: return pingodoceScrapper(url, alias);
        case EL_CORTE_INGLES: return elcorteinglesScrapper(url, alias);
    }
}