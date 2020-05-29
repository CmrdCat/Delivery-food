'use strict'
///////////////// Создание переменных 

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const buttonAuth = document.querySelector('.button-auth'); //Кнопка войти
const modalAuth = document.querySelector('.modal-auth'); //Модальное окно входа
const closeAuth = document.querySelector('.close-auth'); // Х в модальном окне
const logInForm = document.querySelector('#logInForm'); //Форма входа
const logInInput = document.querySelector('#login'); //Поле для ввода логина
const userName = document.querySelector('.user-name'); //Отображение залогиненного 
const buttonOut = document.querySelector('.button-out'); //Кнопка выхода

const cardsRestaurants = document.querySelector('.cards-restaurants'); //Карточки ресторанов
const containerPromo = document.querySelector('.container-promo'); //Контейнер с промо 
const restaurants = document.querySelector('.restaurants'); //Контейнер содержащий рестораны
const menu = document.querySelector('.menu'); //Контейнер для 
const logo = document.querySelector('.logo'); //Контейнер для логотипа
const cardsMenu = document.querySelector('.cards-menu'); //Контейнер для карточек из меню

const restaurantTitle = document.querySelector('.restaurant-title'); //Информация об открытом ресторане на странице с меню
const rating = document.querySelector('.rating'); //Рейтинг открытого ресторана
const minPrice = document.querySelector('.price'); //Минимальная стоимость 
const category = document.querySelector('.category'); //Категория
const modalBody = document.querySelector('.modal-body'); 
const modalPrice = document.querySelector('.modal-pricetag'); 
const buttonClearCart = document.querySelector('.clear-cart'); 


const inputSearch = document.querySelector('.input-search'); //Поле поиска 

let login = localStorage.getItem('Delivery-food')  //Передаем в логин сохранненый в браузере(если имеется) логин
let localString = login ||  '';

const cart =  [];

const loadCart = function() {
	if (localStorage.getItem(login)) {
		JSON.parse(localStorage.getItem(login)).forEach(function(item) {
			cart.push(item);
	})
	}
}


const saveCart = function() {
	localStorage.setItem(login, JSON.stringify(cart))
}

const getData = async function(url) {    				//Функция получения данных из нашей БД

   const response  = await fetch(url)					//await не дает дальше работать функции пока она не получит результат 

   if(!response.ok) {										//Обработка ошибки при отсутствии доступа к бд
		throw new Error (`Ошибка о адресу ${url}, 
		статус ошибки ${response.status}!`);
   }
   
   return await response.json();
}

getData('./db/partners.json');							//Вызываем нашу бд




const valid = function(str) {								//Валидация правильно введённого логина
	const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;	//Через регулярные выражения
	return nameReg.test(str);
}


function toggleModal() {
	modal.classList.toggle("is-open");
}

function toggleModalAuth() { 								//Добавление/удаление класса для открытия элемента
	modalAuth.classList.toggle('is-open');
	logInInput.style.boxShadow = '';
}

function returnMain() {										//Функция для очистки поля ресторанов
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
}

function authorized() { 									//Действия при залогиненном аккаунте
  function logOut() { 										//Функия выхода из аккаунта
	login = null;
	cart.length = 0;
	localStorage.removeItem('Delivery-food');
	buttonAuth.style.display = '';
	userName.style.display = '';
	buttonOut.style.display = '';
	cartButton.style.display = ''
	buttonOut.removeEventListener('click', logOut)
	checkAuth();
	returnMain();
   }
   console.log('авторизован')
   userName.textContent = login; 
   buttonAuth.style.display = 'none';
   userName.style.display = 'inline';
   buttonOut.style.display = 'flex';
  // Изменение стилей для элементов
	cartButton.style.display = 'flex'
	buttonOut.addEventListener('click', logOut)
	loadCart();
};

function notAuthotized() {									//Действия при отсутсвии залогиненного аккаунта
   console.log('не авторизован')

  function logIn(event) { 					//Событие при отправке данных по submit
	 event.preventDefault(); 				//Страница не будет перезагружаться при нажатии на кнопку
	login = logInInput.value;				//Привсваиваем введённое значение
	if (valid(logInInput.value)) {
	localStorage.setItem('Delivery-food',login)
	toggleModalAuth();
	buttonAuth.removeEventListener('click', toggleModalAuth)
	closeAuth.removeEventListener('click', toggleModalAuth)
	logInForm.removeEventListener('submit', logIn)
	 			//Удаляем созданные события
	 logInForm.reset(); 						//Очищаем поле ввода логина 
	checkAuth()
	} else {
		logInInput.style.boxShadow = '0 0 20px red'
		logInInput.value = ''
	}
   }

   buttonAuth.addEventListener('click', toggleModalAuth)
   closeAuth.addEventListener('click', toggleModalAuth)
   logInForm.addEventListener('submit', logIn)
  //Добавляем события для LogOut
}

function checkAuth() {					//Функция проверки авторизации
   if (login) {
		authorized()
   	} else {
			notAuthotized()
   	}
}


function createCardRestaurant(restaurant) {					//Динамическое создание карточек ресторанов
																			// Карточки создаются ввиде нового элемента
   const { image, 
			kitchen, 
			name, 
			price, 
			stars, 
			products, 
			time_of_delivery : timeOfDelivery
	} = restaurant;

	const card = document.createElement('a')
	card.classList.add('card')
	card.classList.add('card-restaurant')
	card.products =  products;
	card.info = [name, price, stars, kitchen];

	card.insertAdjacentHTML('beforeend', `
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title">${name}</h3>
				<span class="card-tag tag">${timeOfDelivery} мин</span>
			</div>
						
			<div class="card-info">
				<div class="rating"> ${stars} </div>
				<div class="price">От ${price} ₽</div>
				<div class="category">${kitchen}</div>
			</div>                
			</div>              
	
	`);
   cardsRestaurants.insertAdjacentElement('beforeend',card);
//Тут в ковычках может быть 4 варианта
//afterbegin | afterend - Вставляет новый блок в начало/конец контейнера
//beforebegin | beforeend - Вставляет блок перед/за контейнером

}

function createCardGood(goods) {							//Создание карточек меню

   const { 
		name,
		image,
		description,
		price,
		id
	} = goods

const card = document.createElement('a');
   card.className = 'card';
   card.insertAdjacentHTML('beforeend',`
		<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title card-title-reg">${name}</h3>
					</div>
					<div class="card-info">
						<div class="ingredients">${description}</div>
					</div>
					<div class="card-buttons">
						<button class="button button-primary button-add-cart" id="${id}">
							<span class="button-card-text">В корзину</span>
							<span class="button-cart-svg"></span>
						</button>
							<strong class="card-price card-price-bold">${price} ₽</strong>
						</div>
			</div>
   `);

   cardsMenu.insertAdjacentElement('beforeend',card);
}


function openGoods(event) { 								//Открывает меню ресторана
   const target = event.target;
  if (login) {  												//Проверка на логин пользователя

	const restaurant = target.closest('.card-restaurant');
	if (restaurant) {
		const [name, price, stars, kitchen] = restaurant.info

		cardsMenu.textContent = '';
		containerPromo.classList.add('hide');
		restaurants.classList.add('hide');
		menu.classList.remove('hide');

		restaurantTitle.textContent = name;
		rating.textContent = stars;
		minPrice.textContent = `От ${price} ₽`;
		category.textContent = kitchen;

		getData(`./db/${restaurant.products}`).then(function(data){ //Вытягивает с бд данные о меню, для каждого элемента создает свою карточку
		data.forEach(createCardGood)
		})
	}
   } else { 
		toggleModalAuth() };
}

function addToCart(event) {

	const target = event.target; 

	const buttonAddToCart = target.closest('.button-add-cart');

	if (buttonAddToCart) {
		const card = target.closest('.card');
		const title = card.querySelector('.card-title-reg').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddToCart.id;

		const food = cart.find(function(item) {
			return item.id === id;
		})

		if (food) {
			food.count += 1;
		} else {
			cart.push({
				id: id,
				title: title,
				cost: cost,
				count: 1,
			});
		};
	};
	saveCart();
}

function renderCart() {
	modalBody.textContent = '';

	cart.forEach(function({ id, title, cost, count }) {
		
		const itemCart = `
		<div class="food-row">
			<span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id="${id}">-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id="${id}">+</button>
			</div>
		</div>
		`;
		modalBody.insertAdjacentHTML('afterbegin',itemCart)
	})

	const totalPrice = cart.reduce(function(result, item) {
		return result + (parseFloat(item.cost)) * item.count;
	}, 0)

	modalPrice.textContent = totalPrice + ` ₽`;
}

function changeCount(event) {
	const target = event.target;

	if (target.classList.contains('counter-button')) {
		const food = cart.find(function (item) {
			return item.id === target.dataset.id;
		})
		if (target.classList.contains('counter-minus')) {
			food.count--;
			if(food.count === 0) {
				cart.splice(cart.indexOf(food), 1)
			}
		}
		if (target.classList.contains('counter-plus')) {food.count++;}
		renderCart();
	}
saveCart();

}

function init() {												//Функция инициализации всего скрипта

   getData('./db/partners.json').then(function (data) {	//Получаем данные из бд о ресторанов, для каждого создаем карточку
	data.forEach(createCardRestaurant)
	}) ;

   cartButton.addEventListener("click", function(){
		renderCart();
		toggleModal();
	});
	

	modalBody.addEventListener('click', changeCount)
	cardsMenu.addEventListener('click',addToCart)
	buttonClearCart.addEventListener('click',function() {
		cart.length = 0;
		renderCart();
	})
   close.addEventListener("click", toggleModal);
   
   cardsRestaurants.addEventListener('click', openGoods);
   
	logo.addEventListener('click',returnMain);
	
	inputSearch.addEventListener('keydown', function(event) {		//Поиск по продуктам
		if(event.keyCode === 13) {
			const target = event.target;
			const value = target.value.toLowerCase().trim();
			
			target.value = '';

			if (!value || value.length < 3) {
				target.style.backgroundColor = 'tomato';
				setTimeout(function () { target.style.backgroundColor = ''; }, 2000);
				return;
			}
			const goods = [];

			getData('./db/partners.json').then(function (data) {
				const products = data.map(function(item){
					return item.products;
				});

				products.forEach(function(product){
					getData(`./db/${product}`).then(function(data){
						goods.push(...data);

						const searchGoods = goods.filter(function(item) {
							return item.name.toLowerCase().includes(value)
						})
						cardsMenu.textContent = '';

						containerPromo.classList.add('hide');
						restaurants.classList.add('hide');
						menu.classList.remove('hide');

						restaurantTitle.textContent = 'Результат поиска';
						rating.textContent = '';
						minPrice.textContent = '';
						category.textContent = '';

						return searchGoods;
					})
						.then(function(data){
							data.forEach(createCardGood);
					})
				});

			});

		};

	})
   
   checkAuth();

   new Swiper('.swiper-container', {
	loop: true,
	autoplay: true,
	})

};

init();