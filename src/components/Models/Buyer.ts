import { IBuyer, TPayment, TBuyerErrors } from '../../types/index';

export class Buyer {
    protected payment: TPayment | undefined = undefined;
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor() {}

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
    }

    getData(): Partial<IBuyer> {
  return {
    payment: this.payment,
    address: this.address,
    email: this.email,
    phone: this.phone
  };
}

    clear(): void {
        this.payment = undefined;;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validate(): { valid: boolean; errors: TBuyerErrors } {
        const errors: TBuyerErrors = {};

        // if (!this.payment) {
        //     errors.payment = 'Не выбран вид оплаты';
        // }

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