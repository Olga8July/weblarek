import { IBuyer } from '../../../types/index';

export class Buyer {
    protected payment: 'card' | 'cash' | null;
    protected address: string;
    protected email: string;
    protected phone: string;

    constructor() {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    setField(field: string, value: string): void {
        if (field === 'payment' && (value === 'card' || value === 'cash')) {
            this.payment = value as 'card' | 'cash';
        } else if (field === 'address') {
            this.address = value;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        }
    }

    setPayment(payment: 'card' | 'cash'): void {
        this.payment = payment;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    getData(): IBuyer {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone
        }
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validate(): { valid: boolean; errors: Record<string, string> } {
        const errors: Record<string, string> = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Укажите адрес';
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