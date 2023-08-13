export default function checkIsPromo(currentPrice: string, defaultPrice: string) {
    if (!currentPrice || !defaultPrice) return false
    return currentPrice < defaultPrice;
}