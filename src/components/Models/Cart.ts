import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Cart {
    protected items: IProduct[];

    constructor(protected events: IEvents) {
        this.items = []
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.events.emit('cart::change');
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('cart::change');
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart::change');
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}