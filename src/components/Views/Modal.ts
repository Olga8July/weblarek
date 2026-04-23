import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement;
  protected modalCloseButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );

    this.modalCloseButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.container.addEventListener('click', (event) => {
      if (event.target == this.container) {
        this.close();
      }
    });

    this.modalCloseButton.addEventListener('click', () => {
      this.close();
    });
  }

  set content(item: HTMLElement) {
    this.modalContent.replaceChildren(item);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }
}