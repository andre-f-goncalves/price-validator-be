import { ProductListInterface } from "../products/product.types"

export type ShoppingListEntry = {
    listName: string;
    listProducts: ProductListInterface[]
}

export type ShoppingListType = ShoppingListEntry[]
