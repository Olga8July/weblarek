import { IProduct } from '../../../types/index';

export class ProductCatalog {
    protected items: IProduct[];
    protected selectedItem: IProduct | null;

    constructor() {
        this.items = [];
        this.selectedItem = null;
    }
    
    setProducts(products: IProduct[]): void {
        this.items = products;
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(product: IProduct): void {
        this.selectedItem = product;
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}