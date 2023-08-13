import { ShoppingListType } from "./shoppingList.types";

export interface UserInterface {
    username: string;
    password: string;
    role: string;
    shoppingLists: ShoppingListType;
}