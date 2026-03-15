import './scss/styles.scss';
import {Catalog} from "./components/models/Catalog.ts";
import {Cart} from "./components/models/Cart.ts";
import {Buyer} from "./components/models/Buyer.ts";
import {apiProducts} from "./utils/data.ts";
import {IProduct} from "./types";

const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

const products: IProduct[] = apiProducts.items;

catalog.saveProducts(products);
console.log(`Массив товаров из каталога: `, catalog.getProducts());

catalog.saveChosenProduct(products[0]);
console.log('Выбранный продукт в каталоге: ', catalog.getChosenProduct());

console.log('Существующий продукт по id: ', catalog.getProduct(products[0].id));

console.log('Несуществующий продукт по id: ', catalog.getProduct("Not-an-id"));


cart.saveProducts(products);
console.log('Список товаров корзины: ', cart.getProducts());
console.log('Общая стоимость товаров: ', cart.getTotalPrice());
console.log('Количество товаров: ', cart.getProductAmount());

console.log('Присутствие товара в корзине: ', cart.isPresent(products[0].id));
console.log('Присутствие левого товара в корзине: ', cart.isPresent('Not-an-id'));

cart.clear();
console.log('Список товаров корзины после очистки: ', cart.getProducts());

cart.addProduct(products[0]);
console.log('Количество товаров в корзине после добавления товара: ', cart.getProductAmount());

cart.removeProduct(products[0]);
console.log('Количество товаров в корзине после удаления товара: ', cart.getProductAmount());


buyer.setAddress('abc')
buyer.setEmail('a@b.c')
buyer.setPhone('+79991234567')
buyer.setPayment('card')
console.log('Покупатель: ', buyer.getBuyer());
console.log('Валидация: ', buyer.validate());

buyer.clear();
console.log('Покупатель после clear: ', buyer.getBuyer());
console.log('Валидация: ', buyer.validate());
