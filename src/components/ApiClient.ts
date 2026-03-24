import { IApi, IServerProductsResponse, IOrderRequest, IOrderResponse } from '../types/index';

export class ApiClient {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IServerProductsResponse> {
        return this.api.get<IServerProductsResponse>('/product/');
    }

    async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}