import {IProduct} from "../../types";
import {IEvents} from "../base/Events.ts";

export class Cart {
    protected products: IProduct[] = [];

    constructor(protected events: IEvents) {
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    addProduct(product: IProduct) {
        this.products.push(product);
        this.events.emit("cart:updated");
    }

    removeProduct(product: IProduct) {
        const index = this.products.indexOf(product);
        this.products.splice(index, 1);
        this.events.emit("cart:updated");
    }

    clear() {
        this.products = [];
        this.events.emit("cart:updated");
    }

    getTotalPrice(): number {
        return this.products.reduce((res, item) => res + (item.price ?? 0), 0);
    }

    getProductAmount(): number {
        return this.products.length;
    }

    isPresent(productId: string): boolean {
        return this.products.some(p => p.id === productId);
    }
}