import {IProduct} from "../../types";
import {EventNames, IEvents} from "../base/Events.ts";

export class Catalog {
    protected products: IProduct[] = [];
    protected chosenProduct: IProduct | null = null;

    constructor(protected events: IEvents) {
    }

    saveProducts(products: IProduct[]) {
        this.products = products;
        this.events.emit(EventNames.CATALOG_UPDATED);
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    saveChosenProduct(product: IProduct | null) {
        this.chosenProduct = product;
        this.events.emit(EventNames.CHOSEN_PRODUCT_UPDATED);
    }

    getChosenProduct(): IProduct | null {
        return this.chosenProduct;
    }

    getProduct(productId: string): IProduct | undefined {
        return this.products.find(item => item.id === productId);
    }

}