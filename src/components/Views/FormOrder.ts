import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';
import { IInput, TPayment } from '../../types';

interface IFormOrder {
  payment?: TPayment | null;
  address: string;
  buttonDisabledState: boolean;
}

export class FormOrder extends Form<IFormOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name=card]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);

    this.cardButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form::card');
    });

    this.cashButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form::cash');
    });

    this.addressInput.addEventListener('change', () => {
      this.events.emit<IInput>('form::address', {
        value: this.addressInput.value,
      });
    });

    this._submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form::next');
    });
  }

  private setPaymentActive(payment: TPayment): void {
    if (payment === 'card') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    }
  }

  set payment(value: TPayment | undefined) {
    if (value) {
      this.setPaymentActive(value);
    } else {
      this.cardButton.classList.remove('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    }
  }
  
  setFocus() {
    this.addressInput.focus();
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}