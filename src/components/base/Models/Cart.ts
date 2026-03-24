import { IProduct } from '../../../types/index';

export class Cart {
    protected items: IProduct[];

    constructor() {
        this.items = []
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    clear(): void {
        this.items = [];
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