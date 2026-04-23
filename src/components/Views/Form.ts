import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IForm {
  errors: string;
}

export class Form<FormInterface> extends Component<IForm | FormInterface> {
  protected formErrors: HTMLSpanElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }

  set buttonDisabledState(state: boolean) {
    this._submitButton.disabled = state;
  }
}