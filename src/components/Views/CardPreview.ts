import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { ICard } from '../../types';
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from '../../utils/constants';

interface ICardPreview extends ICard {
  category: string;
  image: string;
  text: string;
  buttonText: string;
  buttonDisabledState: boolean;
}

export class CardPreview extends Card<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLSpanElement;
  protected textElement: HTMLParagraphElement;
  protected addButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image', this.container);

    this.categoryElement = ensureElement<HTMLSpanElement>(
      '.card__category', this.container);

    this.textElement = ensureElement<HTMLParagraphElement>(
      '.card__text', this.container);

    this.addButton = ensureElement<HTMLButtonElement>(
      '.card__button', this.container);

    this.addButton.addEventListener("click", () => {
      events.emit('preview::to-cart');
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const className of Object.values(categoryMap)) {
        this.categoryElement.classList.remove(className);
    }

    if (value in categoryMap) {
        this.categoryElement.classList.add(
            categoryMap[value as keyof typeof categoryMap]
        );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + '/' + value, this.title);
  }

  set buttonText(value: string) {
    this.addButton.textContent = value;
  }

  set buttonDisabledState(state: boolean) {
    this.addButton.disabled = state;
  }
}