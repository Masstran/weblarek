export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string,
    title: string,
    description: string,
    image: string,
    category: string,
    price: number | null,
}

export type TPayment = 'cash' | 'card' | '';

export interface IBuyer {
    payment: TPayment,
    address: string,
    email: string,
    phone: string
}

export interface IBuyerValidationResult {
    payment?: string,
    address?: string,
    email?: string,
    phone?: string
}

export interface IOrderRequest {
    payment: TPayment,
    address: string,
    phone: string,
    email: string,
    total: number,
    items: string[]
}

export interface IOrderResponse {
    id: string,
    total: number
}

export interface IProductResponse {
    total: number,
    items: IProduct[]
}