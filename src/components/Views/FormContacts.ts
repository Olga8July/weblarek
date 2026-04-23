import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';
import {IInput} from '../../types';

interface IFormContacts {
  buttonDisabledState: boolean;
  phone: string;
  email: string;
}

export class FormContacts extends Form<IFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name=email]', container);

    this.phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', container);

    this.emailInput.addEventListener('change', () =>
      events.emit<IInput>('form::email', { value: this.emailInput.value }),
    );

    this.phoneInput.addEventListener('change', () =>
      events.emit<IInput>('form::phone', { value: this.phoneInput.value }),
    );

    this._submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      events.emit('form::submit');
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}