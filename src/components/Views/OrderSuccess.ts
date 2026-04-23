import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IOrderSuccess {
  price: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected priceOrder: HTMLParagraphElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.priceOrder = ensureElement<HTMLParagraphElement>(
      '.order-success__description',
      this.container
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this.closeButton.addEventListener('click', () => {
      events.emit('success::close');
    });
  }

  set price(value: number) {
    this.priceOrder.textContent = `Списано ${value} синапсов`;
  }
}