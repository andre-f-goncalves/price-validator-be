export default function calculateDiscount(salePrice: string, regularPrice: string) {
    const _regularPrice = Number(regularPrice)
    const _salePrice = Number(salePrice)
    const discount = ((_regularPrice - _salePrice) / _regularPrice) * 100;
    return discount ? `${discount.toFixed(2)}%` : 'N/A';
}