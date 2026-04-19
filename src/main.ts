import './scss/styles.scss';
import {Catalog} from "./components/models/Catalog.ts";
import {Cart} from "./components/models/Cart.ts";
import {Buyer} from "./components/models/Buyer.ts";
import {IOrderRequest, IOrderResponse, IProduct, TModalStates} from "./types";
import {Api} from "./components/base/Api.ts";
import {API_URL} from "./utils/constants.ts";
import {LarekApi} from "./components/communication/LarekApi.ts";
import {EventEmitter, EventNames, IEvents} from "./components/base/Events.ts";
import {ensureElement} from "./utils/utils.ts";
import {Gallery} from "./components/views/Gallery.ts";
import {Modal} from "./components/views/Modal.ts";
import {Success} from "./components/views/Success.ts";
import {CardCatalog} from "./components/views/CardCatalog.ts";
import {CardPreview} from "./components/views/CardPreview.ts";
import {Basket} from "./components/views/Basket.ts";
import {Header} from "./components/views/Header.ts";
import {CardBasket} from "./components/views/CardBasket.ts";
import {Order} from "./components/views/Order.ts";
import {Contacts} from "./components/views/Contacts.ts";

const events: IEvents = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalogModel = new Catalog(events);
const basketModel = new Cart(events);
const buyerModel = new Buyer(events);
const headerView = new Header(events, ensureElement<HTMLElement>(".header"));
const galleryView = new Gallery(events, ensureElement<HTMLElement>(".gallery"));
const modalView = new Modal(events, ensureElement<HTMLElement>(".modal"));
const basketView = new Basket(events);
const orderView = new Order(events);
const contactsView = new Contacts(events);
const successView = new Success(events);

let modalState: TModalStates = "closed";

function renderBasketModal() {
    modalState = "basket";
    const cardProductCards: HTMLElement[] = [];
    basketModel.getProducts().forEach(p => {
        const card = new CardBasket(events, () => {
            events.emit(EventNames.REMOVE_PRODUCT_FROM_BASKET, p);
        });
        cardProductCards.push(card.render(p));
    });
    const basket = basketView.render({
        products: cardProductCards,
        price: basketModel.getTotalPrice()
    });
    modalView.render({content: basket, active: true});
}

function renderChosenProductModal() {
    const chosenProduct = catalogModel.getChosenProduct();
    if (chosenProduct === null) {
        return;
    }
    modalState = "chosenProduct";
    const addToBasketAction = () => {
        events.emit(EventNames.ADD_PRODUCT_TO_BASKET, chosenProduct);
    }
    const removeFromBasketAction = () => {
        events.emit(EventNames.REMOVE_PRODUCT_FROM_BASKET, chosenProduct);
    }
    const inBasket = basketModel.isPresent(chosenProduct.id);
    const cardPreview = new CardPreview(events, addToBasketAction, removeFromBasketAction);
    const cardRender = cardPreview.render({...chosenProduct, inBasket: inBasket});
    modalView.render({content: cardRender, active: true});
}

function renderOrderModal() {
    modalState = "order";
    const validationResult = buyerModel.validate();
    const problems: string[] = [];
    if (validationResult.payment) {
        problems.push(validationResult.payment);
    }
    if (validationResult.address) {
        problems.push(validationResult.address);
    }
    const order = orderView.render({
        ...buyerModel.getBuyer(),
        formErrors: problems,
        buttonIsActive: problems.length === 0
    });
    modalView.render({content: order});
}

function renderContactsModal() {
    modalState = "contacts";
    const validationResult = buyerModel.validate();
    const problems: string[] = [];
    if (validationResult.email) {
        problems.push(validationResult.email);
    }
    if (validationResult.phone) {
        problems.push(validationResult.phone);
    }
    const contacts = contactsView.render({
        ...buyerModel.getBuyer(),
        formErrors: problems,
        buttonIsActive: problems.length === 0
    });
    modalView.render({content: contacts});
}

function renderModalClose() {
    modalState = 'closed';
    modalView.render({active: false});
}

events.on(EventNames.OPEN_BASKET, () => {
    renderBasketModal();
});
events.on(EventNames.CLOSE_MODAL, () => {
    renderModalClose();
});
events.on(EventNames.OPEN_PRODUCT, (data: IProduct) => {
    catalogModel.saveChosenProduct(data);
});
events.on(EventNames.ADD_PRODUCT_TO_BASKET, (data: IProduct) => {
    basketModel.addProduct(data);
    renderModalClose();
});
events.on(EventNames.REMOVE_PRODUCT_FROM_BASKET, (data: IProduct) => {
    basketModel.removeProduct(data);
    if (modalState === "chosenProduct") {
        renderModalClose();
    }
});
events.on(EventNames.BASKET_ORDER, () => {
    renderOrderModal();
});

events.on(EventNames.PAYMENT_CARD, () => {
    buyerModel.setPayment("card");
});
events.on(EventNames.PAYMENT_CASH, () => {
    buyerModel.setPayment("cash");
});
events.on(EventNames.ADDRESS_INPUT, (data: {value: string}) => {
    buyerModel.setAddress(data.value);
});
events.on(EventNames.ORDER_SUBMIT, () => {
    console.assert(modalState === "order")
    renderContactsModal();
});
events.on(EventNames.EMAIL_INPUT, (data: {value: string}) => {
    buyerModel.setEmail(data.value);
});
events.on(EventNames.PHONE_INPUT, (data: {value: string}) => {
    buyerModel.setPhone(data.value);
});
events.on(EventNames.CONTACTS_SUBMIT, () => {
    console.assert(modalState === "contacts")
    const order: IOrderRequest = {
        ...buyerModel.getBuyer(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getProducts().map(product => product.id)
    }
    larekApi.sendOrder(order)
        .then((response: IOrderResponse) => {
            modalState = "success";
            const success = successView.render({amount: response.total});
            modalView.render({content: success});
            buyerModel.clear();
            basketModel.clear();
        })
        .catch((err) => {
            console.log(err);
        });
});
events.on(EventNames.SUCCESS_CLOSE, () => {
    modalState = "closed";
    modalView.render({active: false});
})
events.on(EventNames.BUYER_UPDATED, () => {

    if (modalState === "order") {
        renderOrderModal();
    }
    if (modalState === "contacts") {
        renderContactsModal();
    }
});


events.on(EventNames.CART_UPDATED, () => {
    headerView.render({counter: basketModel.getProductAmount()});
    if (modalState === "basket") {
       renderBasketModal();
    }
    if (modalState === "chosenProduct") {
        renderChosenProductModal();
    }

});

events.on(EventNames.CATALOG_UPDATED, () => {
    const productCards: HTMLElement[] = [];
    catalogModel.getProducts().forEach(p => {
        const card = new CardCatalog(events, () => {
            events.emit(EventNames.OPEN_PRODUCT, p)
        })
        productCards.push(card.render(p));
    })
    galleryView.render({gallery: productCards});
});

events.on(EventNames.CHOSEN_PRODUCT_UPDATED, () => {
    renderChosenProductModal();
});



// Let's test api
try {
    const larekProducts: IProduct[] = await larekApi.getProducts();
    catalogModel.saveProducts(larekProducts);
} catch (err) {
    console.log(err);
}


