import { Api } from './components/base/Api';
import { ApiClient } from './components/ApiClient';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { ProductCatalog } from './components/Models/ProductCatalog';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Проверка Модели ProductCatalog
const productCatalogModel = new ProductCatalog();

productCatalogModel.setProducts(apiProducts.items);
console.log(`Массив товаров из каталога:`, productCatalogModel.getProducts());

const firstProduct = productCatalogModel.getProductById(apiProducts.items[0].id);
console.log('Товар по ID:', firstProduct);

const notFoundProduct = productCatalogModel.getProductById('111');
console.log('Такого товара не существует:', notFoundProduct);

if (firstProduct) {
  productCatalogModel.setSelectedItem(firstProduct);
  console.log('Выбранный товар для просмотра:', productCatalogModel.getSelectedItem());
}

const selected = productCatalogModel.getSelectedItem();
console.log('Совпадает с сохранённым?', selected === firstProduct);

// Проверка Модели Cart
const cartModel = new Cart();

const productToAdd = apiProducts.items[0];
cartModel.addItem(productToAdd);
console.log('Добавлен товар в корзину:', productToAdd);
console.log('Товар есть в корзине?', cartModel.hasItem(productToAdd.id));

console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getCount());
console.log('Общая стоимость:', cartModel.getTotal());

const secondProduct = apiProducts.items[1];
cartModel.addItem(secondProduct);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getCount());
console.log('Общая стоимость:', cartModel.getTotal());

cartModel.removeItem(secondProduct.id);
console.log('Удалённый товар есть в корзине?', cartModel.hasItem(secondProduct.id));
console.log('Товары в корзине после удаления:', cartModel.getItems());
console.log('Количество товаров после удаления:', cartModel.getCount());
console.log('Общая стоимость после удаления:', cartModel.getTotal());

cartModel.clear();
console.log('Корзина очищена');
console.log('Товары после очистки:', cartModel.getItems());
console.log('Количество:', cartModel.getCount());
console.log('Стоимость:', cartModel.getTotal());

// проверка Модели Bueyr
const buyerModel = new Buyer();

buyerModel.setPayment('card');
buyerModel.setAddress('г. Минск, ул. Скорины, 8');
buyerModel.setEmail('test@test.com');
buyerModel.setPhone('+375291111111');

console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация:', buyerModel.validate());

buyerModel.setField('payment', 'cash');
console.log('Установлен payment через setField:', buyerModel.getData().payment);
buyerModel.setField('address', 'г. Минск, ул. Скорины, 8');
console.log('Установлен address через setField:', buyerModel.getData().address);
buyerModel.setField('email', 'test@test.com');
console.log('Установлен email через setField:', buyerModel.getData().email);
buyerModel.setField('phone', '+375291111111');
console.log('Установлен phone через setField:', buyerModel.getData().phone);

buyerModel.clear();
console.log('Данные:', buyerModel.getData());
console.log('Валидация:', buyerModel.validate());

// работа с сервером
const api = new Api(API_URL);

const apiClient = new ApiClient(api);

apiClient.getProducts()
    .then((response) => {
      productCatalogModel.setProducts(response.items);
      const catalogItems = productCatalogModel.getProducts();
      console.log('Каталог товаров с сервера:', catalogItems);
    })
     .catch((error) => {
        console.error('Ошибка при получении данных с сервера:', error);
    }); 
