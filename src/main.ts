import './scss/styles.scss';
import {Catalog} from "./components/models/Catalog.ts";
import {Cart} from "./components/models/Cart.ts";
import {Buyer} from "./components/models/Buyer.ts";
import {apiProducts} from "./utils/data.ts";
import {IOrderResponse, IProduct} from "./types";
import {Api} from "./components/base/Api.ts";
import {API_URL} from "./utils/constants.ts";
import {LarekApi} from "./components/communication/LarekApi.ts";
import {EventEmitter, IEvents} from "./components/base/Events.ts";
import {ensureElement} from "./utils/utils.ts";
import {Gallery} from "./components/views/Gallery.ts";
import {Modal} from "./components/views/Modal.ts";
import {Success} from "./components/views/Success.ts";
import {CardCatalog} from "./components/views/CardCatalog.ts";
import {Card} from "./components/views/Card.ts";
import {CardPreview} from "./components/views/CardPreview.ts";
import {Basket} from "./components/views/Basket.ts";
import {Header} from "./components/views/Header.ts";
import {CardBasket} from "./components/views/CardBasket.ts";
import {Order} from "./components/views/Order.ts";
import {Contacts} from "./components/views/Contacts.ts";

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

cart.addProduct(products[0]);
cart.addProduct(products[1]);

console.log('Количество товаров в корзине после добавления товара: ', cart.getProductAmount());

console.log('Список товаров корзины: ', cart.getProducts());
console.log('Общая стоимость товаров: ', cart.getTotalPrice());
console.log('Количество товаров: ', cart.getProductAmount());

console.log('Присутствие товара в корзине: ', cart.isPresent(products[0].id));
console.log('Присутствие левого товара в корзине: ', cart.isPresent('Not-an-id'));

cart.removeProduct(products[0]);
console.log('Количество товаров в корзине после удаления товара: ', cart.getProductAmount());

cart.clear();
console.log('Список товаров корзины после очистки: ', cart.getProducts());


buyer.setAddress('abc')
buyer.setEmail('a@b.c')
buyer.setPhone('+79991234567')
buyer.setPayment('card')
console.log('Покупатель: ', buyer.getBuyer());
console.log('Валидация корректного покупателя: ', buyer.validate());

buyer.clear();
console.log('Покупатель после clear: ', buyer.getBuyer());
console.log('Валидация некорректного покупателя: ', buyer.validate());

// Let's test api

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
try {
    const larekProducts: IProduct[] = await larekApi.getProducts();
    catalog.saveProducts(larekProducts);
    console.log('Продукты из API: ', catalog.getProducts());
    cart.addProduct(larekProducts[0]);
    cart.addProduct(larekProducts[1]);
    console.log('Корзина: ', cart.getProducts())
    buyer.setAddress('abc')
    buyer.setEmail('a@b.c')
    buyer.setPhone('+79991234567')
    buyer.setPayment('card')
    console.log('Покупатель: ', buyer.getBuyer())
    const response: IOrderResponse = await larekApi.sendOrder({
        ...buyer.getBuyer(),
        total: cart.getTotalPrice(),
        items: cart.getProducts().map(product => product.id)
    })

    console.log('Результат заказа: ', response)
} catch (err) {
    console.log(err);
}


// Test view layer
const galleryElement = document.querySelector('.gallery');
const modalElement = document.querySelector('.modal');
const headerElement = document.querySelector('.header');
const events: IEvents = new EventEmitter();

const gallery = new Gallery(events, ensureElement<HTMLElement>(".gallery"));
const productCards: HTMLElement[] = [];
try {
    const larekProducts: IProduct[] = await larekApi.getProducts();
    larekProducts.forEach(p => {
        const card = new CardCatalog(events, () => {
            events.emit("product:open", p)
        })
        productCards.push(card.render(p));
    })
} catch (err) {
    console.log(err);
}

const modal = new Modal(events, ensureElement<HTMLElement>(".modal"));
// const header = new Header(events, ensureElement<HTMLElement>(".header"));
const success = new Success(events);
const basket = new Basket(events);
const header = new Header(events, ensureElement<HTMLElement>(".header"));
// headerElement?.replaceWith(header.render({counter: cart.getProductAmount()}));
// const cardsBasket: HTMLElement[] = [];
// cart.getProducts().forEach(p => {
//     const cardBasket = new CardBasket(events, () => {});
//     cardsBasket.push(cardBasket.render(p));
// })
// modalElement?.replaceWith(modal.render({content: basket.render({products: cardsBasket, price: cart.getTotalPrice()}), active: true}))

const order = new Order(events);
const contacts = new Contacts(events);
modalElement?.replaceWith(modal.render({content: order.render({buttonIsActive: true}), active: true}))

// const component = new Gallery(events, document.querySelector('.gallery') || document.createElement("div"));
// const listItem = document.createElement("div");
// listItem.innerHTML = "<span>Wtf</span>";
// component.gallery = Array.of(listItem);
events.on("product:open", p => {
    const cardPreview = new CardPreview(events, () => {}, () => {});
    modalElement?.replaceWith(modal.render({content: cardPreview.render(p), active: true}))
})
events.on("modal:close", () => {
    modalElement?.replaceWith(modal.render({active: false}))
})
events.on("basket:open", () => {
    modalElement?.replaceWith(modal.render({content: basket.render(), active:true}))
})
events.on("order:submit", () => {
    modalElement?.replaceWith(modal.render({content: contacts.render(), active: true}))
})
galleryElement?.replaceWith(gallery.render({gallery: productCards}));
