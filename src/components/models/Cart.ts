import {IProduct} from "../../types";

export class Cart {
    protected _products: IProduct[] = [];

    saveProducts(products: IProduct[]) {
        this._products = products;
    }

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
        let price = 0;
        this._products.forEach(product => {
            price += product.price ?? 0;
        })
        return price;
    }

    getProductAmount(): number {
        return this._products.length;
    }

    isPresent(productId: string) {
        return productId in this._products.map(p => p.id);
    }
}