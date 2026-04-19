
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


### Данные

#### Интерфейс IProduct
Интерфейс описывает данные товаров магазина.

Поля интерфейса:  
`id: string` - уникальный идентификатор товара
`title: string` - имя товара
`description: string` - подробное описание товара
`image: string` - ссылка на изображение товара
`category: string` - категория товара
`price: number | null` - стоимость товара (либо null для бесценных)

#### Интерфейс IBuyer
Интерфейс описывает данные покупателя.

Поля интерфейса:  
`payment: TPayment` - выбранный способ оплаты. `type TPayment = 'cash' | 'card' | ''`, пустая строка обозначает, что выбор не сделан
`address: string` - адрес покупателя
`email: string` - email покупателя
`phone: string` - телефонный номер покупателя

#### Интерфейс IBuyerValidationResult
Интерфейс описывает модель валидации данных о покупателе

Поля интерфейса:  
`payment?: string` - текст ошибки валидации способа оплаты
`address?: string` - текст ошибки валидации адреса покупателя
`email?: string` - текст ошибки валидации email покупателя
`phone?: string` - текст ошибки валидации телефонного номера покупателя

### Модели данных

#### Класс Catalog
Класс отвечает за хранение и отображение товаров в каталоге

Конструктор:  
Конструктор класса не принимает параметров.

Поля класса:  
`_products: IProduct[]` - список товаров в каталоге  
`_chosenProduct: IProduct | null` - выбранный товар для подробного отображения, null если товар не выбран

Методы:  
`saveProducts(products: IProduct[]): void` - обновляет список товаров
`getProducts(): IProduct[]` - возвращает список товаров
`saveChosenProduct(product: IProduct | null): void` - сохраняет выбранный товар   
`getChosenProduct(): IProduct | null` - возвращает выбранный товар
`getProduct(productId: string): IProduct | undefined` - возвращает товар по заданному id

#### Класс Cart
Класс отвечает за хранение и отображение товаров в корзине

Конструктор:  
Конструктор класса не принимает параметров.

Поля класса:  
`_products: IProduct[]` - список товаров в каталоге  

Методы:  
`getProducts(): IProduct[]` - возвращает список товаров
`addProduct(product: IProduct): void` - добавляет товар в корзину
`removeProduct(product: IProduct): void` - удаляет товар из корзины
`clear(): void` - очищает корзину
`getTotalPrice(): number` - возвращает общую стоимость корзины   
`getProductAmount(): number` - возвращает количество товаров в корзине
`isPresent(productId: string): boolean` - проверяет наличие товара в корзине по id

#### Класс Buyer
Класс отвечает за хранение и валидацию данных, введённых покупателем в форме

Конструктор:  
Конструктор класса не принимает параметров.

Поля класса:  
`_buyer: IBuyer` - интерфейс, описывающий информацию о покупателе

Методы:  
`setPayment(payment: TPayment): void` - сохраняет выбранный способ оплаты
`setAddress(address: string): void` - сохраняет введённый адрес
`setEmail(email: string): void` - сохраняет введённый email
`setPhone(phone: string): void` - сохраняет введённый номер телефона
`getBuyer(): IBuyer` - возвращает данные о покупателе
`clear(): void` - очищает все данные
`validate(): IBuyerValidationResult` - валидирует заполненные поля и возвращает найденные ошибки


### Слой коммуникации 

#### Класс LarekApi

Конструктор:  
`constructor(api: IApi)` - конструктор принимает класс api с подготовленным хостом и параметрами

Поля класса:  
`_api: IApi` - внутренний объект для api запросов

Методы:  
`async getProducts(): Promise<IProduct[]>` - возвращает промис на список продуктов из API
`async sendOrder(order: IOrderRequest): Promise<IOrderResponse>` - отправляет заказ в API и возвращает промис с результатом

### Слой представления

#### Класс Template<T>

Наследует класс Component<T>. Объединяет в себе общую логику элементов, использующих функционал шаблонов

Конструктор:
`constructor(templateId: string)` - клонирует шаблон и использует его в классе Component

Поля класса отсутствуют
Методы класса отсутствуют

#### Класс Header

Наследует класс Component<IHeader>, где IHeader - тип `{counter: number}`

Конструктор:
`constructor(protected events: IEvents, container: HTMLElement)` - конструктор принимает брокер событий и свой контейнер

Поля класса:
`counterElement: HTMLElement` - элемент счётчик корзины
`basketButtonElement: HTMLElement` - кнопка открытия корзины

Методы:
`set counter(value: number)` - отображает новое значение на счётчике

#### Класс Gallery

Наследует класс Component<IGallery>, где IGallery - тип `{gallery: HTMLElement[]}`

Конструктор:
`constructor(protected events: IEvents, container: HTMLElement)` - конструктор принимает брокер событий и свой контейнер

Поля класса:
`catalogElement: HTMLElement` - верхний элемент каталога, под которым создаются карточки товаров

Методы:
`set gallery(items: HTMLElement[])` - заменяет элементы каталога

#### Класс Modal

Наследует класс Component<IModal>, где IModal - тип `{content: HTMLElement; active: boolean;}`

Конструктор:
`constructor(protected events: IEvents, container: HTMLElement)` - конструктор принимает брокер событий и свой контейнер

Поля класса:
`modalContentElement: HTMLElement` - элемент контента модального окна
`closeButtonElement: HTMLButtonElement` - кнопка закрытия модального окна

Методы:
`set active(isActive: boolean)` - выставляет открыто ли модальное окно
`set content(element: HTMLElement)` - изменяет контент модального окна


#### Класс Card
Общий класс для всех Card сущностей

Наследует класс Template<ICard>, где ICard - тип `Omit<IProduct, 'id'> & {inBasket?: boolean}`

Дополнительно определён тип `type CategoryMapKey = keyof typeof categoryMap`

Конструктор:
`constructor(templateId: string)` - создаёт контейнер из темплейта и находит нужные элементы в нём

Поля класса:
`categoryElement: HTMLElement | null` - элемент категории товара (если есть)
`titleElement: HTMLElement | null` - элемент имени товара (если есть)
`imageElement: HTMLImageElement | null` - элемент изображения товара (если есть)
`priceElement: HTMLElement | null` - элемент цены товара (если есть)
`textElement: HTMLElement | null` - элемент описания товара (если есть)

Методы:
`set category(value: CategoryMapKey)` - выставляет значение категории товара
`set title(value: string)` - выставляет значение имени товара
`set image(value: string)` - выставляет значение изображения товара
`set price(value: number | null)` - выставляет значение цены товара (или бесценно, если цена отсутствует)
`set description(value: string)` - выставляет значение описания товара

#### Класс CardCatalog

Наследует класс Card

Конструктор:
`constructor(protected events: IEvents, onClickAction: () => void)` - конструктор принимает брокер событий и действие по нажатию на элемент

Поля класса:
`cardButtonElement: HTMLButtonElement` - кнопка для открытия товара

Методы отсутствуют

#### Класс CardPreview

Наследует класс Card

Конструктор:
`constructor(protected events: IEvents, protected addToBasketAction: () => void, protected removeFromBasketAction: () => void)` - конструктор принимает брокер событий и действия добавления и удаления товара из корзины

Поля класса:
`cardButtonElement: HTMLButtonElement` - кнопка добавления/удаления товара из корзины

Методы:
`set price(value: number | null)` - вызывает родительский метод, а также деактивирует кнопку покупки если цена не указана
`set inBasket(value: boolean)` - заменяет кнопку добавления/удаления товара из корзины в зависимости от того, есть ли он в корзине

#### Класс CardBasket

Наследует класс Card

Конструктор:
`constructor(protected events: IEvents, removeFromBasketAction: () => void)` - конструктор принимает брокер событий и действие удаления товара из корзины

Поля класса:
`cardButtonElement: HTMLButtonElement` - кнопка удаления товара из корзины

Методы отсутствуют

#### Класс Basket

Наследует класс Template<IBasket>, где IBasket - тип `{products: HTMLElement[]; price: number;}`

Конструктор:
`constructor(protected events: IEvents)` - конструктор принимает брокер событий

Поля класса:
`priceElement: HTMLElement` - элемент общей стоимости корзины
`listElement: HTMLElement` - верхний элемент списка товаров
`orderButtonElement: HTMLButtonElement` - кнопка оформления заказа

Методы:
`set price(value: number)` - выставляет общую стоимость товаров
`set products(items: HTMLElement[])` - выставляет список товаров

#### Класс Order
Наследует класс Template<IOrder>, где IOrder - тип `Omit<IBuyer, "email" | "phone"> & {formErrors?: HTMLElement[], buttonIsActive?: boolean`

Конструктор:
`constructor(protected events: IEvents)` - конструктор принимает брокер событий

Поля класса:
`cardPaymentButtonElement: HTMLButtonElement` - кнопка выбрать способ оплаты "картой"
`cashPaymentButtonElement: HTMLButtonElement` - кнопка выбрать способ оплаты "наличкой"
`addressInputElement: HTMLInputElement` - инпут ввода адреса
`submitButtonElement: HTMLButtonElement` - кнопка отправки формы
`formErrorsElement: HTMLElement` - верхний элемент списка ошибок

Методы:
`set payment(value: TPayment)` - выставляет выбранный способ оплаты
`set address(value: string)` - выставляет адрес
`set formErrors(items: HTMLElement[] | null)` - выставляет список ошибок
`set buttonIsActive(value: boolean | null)` - выставляет активна ли кнопка отправки формы

#### Класс Contacts

Наследует класс Template<IContacts>, где IContacts - тип `Omit<IBuyer, "address" | "payment"> & {formErrors?: HTMLElement[], buttonIsActive?: boolean`

Конструктор:
`constructor(protected events: IEvents)` - конструктор принимает брокер событий

Поля класса:
`emailInputElement: HTMLInputElement` - инпут ввода email
`phoneInputElement: HTMLInputElement` - инпут ввода номера телефона
`submitButtonElement: HTMLButtonElement` - кнопка отправки формы
`formErrorsElement: HTMLElement` - верхний элемент списка ошибок

Методы:
`set email(value: string)` - выставляет email
`set phone(value: string)` - выставляет номер телефона
`set formErrors(items: HTMLElement[] | null)` - выставляет список ошибок
`set buttonIsActive(value: boolean | null)` - выставляет активна ли кнопка отправки формы

#### Класс Success
Наследует класс Template<ISuccess>, где ISuccess - тип `{amount: number}`

Конструктор:
`constructor(protected events: IEvents)` - конструктор принимает брокер событий

Поля класса:
`amountElement: HTMLElement` - элемент общего количества потраченных денег
`closeButtonElement: HTMLButtonElement` - кнопка закрытия

Методы:
`set amount(value: number)` - выставляет количество потраченных денег

### События

`basket:open` - нажата кнопка открытия корзины
`modal:close` - нажата кнопка закрытия модального окна
`product:open` - нажата кнопка открытия продукта (нажата карточка товара)
`product:addToBasket` - нажата кнопка добавления товара в корзину
`product:removeFromBasket` - нажата кнопка удаления товара из корзины
`order:payment:select:card` - выбран способ оплаты "картой"
`order:payment:select:cash` - выбран способ оплаты "наличными"
`order:address:input` - изменён инпут адреса
`order:submit` - нажата кнопка отправки формы класса Order
`contacts:email:input` - изменён инпут email
`contacts:phone:input` - изменён инпут номера телефона
`contacts:submit` - нажата кнопка отправки формы класса Contacts
