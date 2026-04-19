import {IApi, IOrderRequest, IOrderResponse, IProductResponse} from "../../types";

export class LarekApi {
    protected _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    async getProducts(): Promise<IProductResponse> {
        return await this._api.get("/product/") as IProductResponse;
    }

    async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return await this._api.post("/order/", order)
    }
}