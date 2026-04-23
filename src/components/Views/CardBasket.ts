import {ensureElement} from '../../utils/utils';
import { Card } from './Card';
import { ICard } from '../../types';
import { ICardActions } from '../../types';

export interface ICardBasket extends ICard {
  itemIndex: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected cardIndex: HTMLElement;
    protected itemDeleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions: ICardActions) {
        super(container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);

        this.itemDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.itemDeleteButton.addEventListener('click', actions.onClick);
    }

    set itemIndex(value: number) {
        this.cardIndex.textContent = value.toString();
    }
}