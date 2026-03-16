import {IApi, IOrderRequest, IOrderResponse, IProduct, IProductResponse} from "../../types";

export class LarekApi {
    protected _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this._api.get("/product/") as IProductResponse;
        return response.items;
    }

    async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return await this._api.post("/order/", order)
    }
}