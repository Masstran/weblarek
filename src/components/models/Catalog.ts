import {IProduct} from "../../types";

export class Catalog {
    protected _products: IProduct[] = [];
    protected _chosenProduct: IProduct | null = null;

    saveProducts(products: IProduct[]) {
        this._products = products;
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    saveChosenProduct(product: IProduct | null) {
        this._chosenProduct = product;
    }

    getChosenProduct(): IProduct | null {
        return this._chosenProduct;
    }

    getProduct(productId: string): IProduct | undefined {
        return this._products.find(item => item.id === productId);
    }

}