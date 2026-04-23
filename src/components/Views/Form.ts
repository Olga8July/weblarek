import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IForm {
  errors: string;
}

export class Form<FormInterface> extends Component<IForm | FormInterface> {
  protected formErrors: HTMLSpanElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', container);
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }
}