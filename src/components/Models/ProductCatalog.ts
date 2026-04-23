import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    protected items: IProduct[];
    protected selectedItem: IProduct | null;

    constructor(protected events: IEvents) {
        this.items = [];
        this.selectedItem = null;
    }
    
    setProducts(products: IProduct[]): void {
        this.items = products;
        this.events.emit('catalog:changed')
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(product: IProduct): void {
        this.selectedItem = product;
        this.events.emit('catalog::select')
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}