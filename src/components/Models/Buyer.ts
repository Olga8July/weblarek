import { IBuyer, TPayment, TBuyerErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
    protected payment: TPayment | null = null;
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor(protected events: IEvents) {}

    setField(field: string, value: string): void {
        if (field === 'payment' && (value === 'card' || value === 'cash')) {
            this.payment = value;
        } else if (field === 'address') {
            this.address = value;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        }
        this.events.emit('buyer::set-data');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clear(): void {
        this.payment = null;;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('buyer::set-data');
    }

    validate(): { valid: boolean; errors: TBuyerErrors } {
        const errors: TBuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.email.trim()) {
            errors.email = 'Укажите емэйл';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }
}