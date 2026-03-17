import {IProduct} from "../../types";

export class Cart {
    protected _products: IProduct[] = [];

    getProducts(): IProduct[] {
        return this._products;
    }

    addProduct(product: IProduct) {
        this._products.push(product);
    }

    removeProduct(product: IProduct) {
        const index = this._products.indexOf(product);
        this._products.splice(index, 1);
    }

    clear() {
        this._products = [];
    }

    getTotalPrice(): number {
        return this._products.reduce((res, item) => res + (item.price ?? 0), 0);
    }

    getProductAmount(): number {
        return this._products.length;
    }

    isPresent(productId: string): boolean {
        return this._products.some(p => p.id === productId);
    }
}