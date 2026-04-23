import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ApiClient } from './components/ApiClient';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Basket } from './components/Views/Basket';
import { CardBasket } from './components/Views/CardBasket';
import { CardCatalog } from './components/Views/CardCatalog';
import { CardPreview } from './components/Views/CardPreview';
import { FormContacts } from './components/Views/FormContacts';
import { FormOrder } from './components/Views/FormOrder';
import { Gallery } from './components/Views/Gallery';
import { Header } from './components/Views/Header';
import { Modal } from './components/Views/Modal';
import { OrderSuccess } from './components/Views/OrderSuccess';
import { IBuyer, IProduct, IOrderRequest, IInput } from './types';

const events = new EventEmitter();
const productCatalogModel = new ProductCatalog();
const cartModel = new Cart();
const buyerModel = new Buyer();
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

const header = new Header(events, ensureElement('header'));
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('.modal'));
const basket = new Basket(cloneTemplate('#basket'), events);
basket.buttonStatus = true;
const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);
const formOrder = new FormOrder(events, cloneTemplate('#order'));
const formContacts = new FormContacts(events, cloneTemplate('#contacts'));
const orderSuccess = new OrderSuccess(events, cloneTemplate('#success'));


apiClient.getProducts()
  .then((response) => {
    productCatalogModel.setProducts(response.items);
    events.emit('catalog:changed');
  })
  .catch(error => {
    console.error('Ошибка при получении данных с сервера:', error);
  });


events.on('catalog:changed', () => {
  const itemCards = productCatalogModel.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), {
      onClick: () => events.emit('card::select', item),
    });
    return card.render(item);
  });

  gallery.render({catalog: itemCards});
});

events.on('card::select', (item: IProduct) => {
  productCatalogModel.setSelectedItem(item);
  events.emit('catalog::select');
});

events.on('catalog::select', () => {
  const product = productCatalogModel.getSelectedItem();

  if (!product) return;

  cardPreview.buttonDisabledState = false;

  if (!product.price) {
    cardPreview.buttonText = 'Недоступно';
    cardPreview.buttonDisabledState = true;
  } else if (cartModel.hasItem(product.id)) {
    cardPreview.buttonText = 'Удалить из корзины';
  } else {
    cardPreview.buttonText = 'Купить';
  }

  const card = cardPreview.render({ ...product });
  modal.render({ content: card });
  modal.open();
});

events.on('preview::to-cart', () => {
  const product = productCatalogModel.getSelectedItem();
  if (product) {
    if (cartModel.hasItem(product.id)) {
      cartModel.removeItem(product.id);
    } else {
      cartModel.addItem(product);
    }
    events.emit('cart::change');
  }
  modal.close();
});

events.on('cart::change', () => {
  const basketList = cartModel.getItems().map((item, index) => {
    const basketItem = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => events.emit('basket::delete', item),
    });
    return basketItem.render({ itemIndex: index + 1, ...item });
  });

  basket.render({
    basketList: basketList,
    buttonStatus: cartModel.getTotal() === 0,
    basketPrice: cartModel.getTotal(),
  });

  header.counter = cartModel.getCount();
});

events.on('basket::open', () => {
  const products = cartModel.getItems();
  const totalPrice = cartModel.getTotal();
  const isEmpty = totalPrice === 0;

  const basketList = products.map((item, index) => {
    const basketItem = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => events.emit('basket::delete', item),
    });
    return basketItem.render({ itemIndex: index + 1, ...item });
  });

  modal.content = basket.render({
    basketList,
    basketPrice: totalPrice,
    buttonStatus: isEmpty,
  });
  modal.open();
});

events.on('basket::delete', (item: IProduct) => {
  cartModel.removeItem(item.id);
  
  events.emit('cart::change');
  
  const products = cartModel.getItems();
  const totalPrice = cartModel.getTotal();
  const isEmpty = totalPrice === 0;

  const basketList = products.map((item, index) => {
    const basketItem = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => events.emit('basket::delete', item),
    });
    return basketItem.render({ itemIndex: index + 1, ...item });
  });

  modal.content = basket.render({
    basketList,
    basketPrice: totalPrice,
    buttonStatus: isEmpty,
  });
});

events.on('basket::make-order', () => {

  modal.content = formOrder.render({
    address: '',
    buttonDisabledState: true
  });
  modal.open();
  formOrder.setFocus();
  events.emit('buyer::set-data')
  formOrder.errors = '';
});

events.on('form::card', () => {
  buyerModel.setField('payment', 'card');
  events.emit('buyer::set-data');
  formOrder.setFocus()
});

events.on('form::cash', () => {
  buyerModel.setField('payment', 'cash');
  events.emit('buyer::set-data');
  formOrder.setFocus()
});

events.on('form::address', (data: IInput) => {
  buyerModel.setField('address', String(data.value));
  events.emit('buyer::set-data')
});

events.on('form::email', (data: IInput) => {
  buyerModel.setField('email', String(data.value));
  events.emit('buyer::set-data')
});

events.on('form::phone', (data: IInput) => {
  buyerModel.setField('phone', String(data.value));
  events.emit('buyer::set-data')
});

events.on('form::next', () => {
  formContacts.errors = "";

  const { email, phone } = buyerModel.getData();

  modal.content = formContacts.render({
    email: email || '',
    phone: phone || '',
    buttonDisabledState: !(email && phone)
  });
  modal.open();
});

events.on('form::submit', () => {
  const validation = buyerModel.validate();
  if (!validation.valid) {
    events.emit('buyer::set-data');
    return;
  }

  const order: IOrderRequest = {
    ...(buyerModel.getData() as IBuyer),
    total: cartModel.getTotal(),
    items: cartModel.getItems().map(el => el.id)
  };

  apiClient.createOrder(order)
    .then((data) => {
      cartModel.clear();
      buyerModel.clear();
      orderSuccess.price = data.total ?? 0;
      modal.content = orderSuccess.render();
      modal.open();
    })
    .catch(e => console.error(e));
});

events.on('buyer::set-data', () => {
  const { address, payment, phone, email } = buyerModel.getData();

  formOrder.render({ 
    payment,
    address 
  });

  formContacts.render({ phone, email });

  const { errors } = buyerModel.validate();

  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(', ');

  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join(', ');

  formOrder.errors = orderErrors;
  formContacts.errors = contactsErrors;

  formOrder.buttonDisabledState = orderErrors.length > 0;
  formContacts.buttonDisabledState = contactsErrors.length > 0;
});

events.on('success::close', () => {
  modal.close();
});