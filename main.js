const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';


// переменные
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    pagination = document.querySelector('.pagination');

// элемент загрузки

const loading = document.createElement('div');
loading.className = 'loading';

// Получение данных с сервера

class DBService {

    constructor(){
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = '0e24fefe778f9137707d44e5c2dd04d1';
    }
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Не удалось получить данные по адресу ${SERVER}')
        }
    }

    getTestData = () => {
        return this.getData('test.json')
    }

    getTestCard = () => {
        return this.getData('card.json')
    }
    getSearchResult = query => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
    }
    getNextPage = page => {
        return this.getData(this.temp + '&page=' + page);
    }
    getTvShows = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    getToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
};

const dbService = new DBService ();

// Открытие/закрытие меню

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
};

hamburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
})

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active')
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
    if (target.closest('#top-rated')) {
        dbService.getTopRated().then((response) => renderCard(response, target));
    }
    if (target.closest('#popular')) {
        dbService.getPopular().then(renderCard);
    }
    if (target.closest('#week')) {
        dbService.getWeek().then((response) => renderCard(response, target));
    }
    if (target.closest('#today')) {
        dbService.getToday().then((response) => renderCard(response, target));
    }
});

// Создание карточки с фильмом

const renderCard = (response, target) => {
    tvShowList.textContent = '';

    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'К сожалению по вашему запросу ни чего не найдено...';
        tvShowsHead.style.cssText = 'color: black; text-shadow: 2px 8px 6px rgba(0,0,0,0.2), 0px -5px 35px rgba(255,255,255,0.3);'
        return;
        };
        
    
    response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster, 
            vote_average: vote,
            id
            } = item; 
            
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; 
        const card = document.createElement('li');
        card.className = 'tv-show__item';
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>     
        `;
        loading.remove();
        tvShowList.append(card);
    })
    pagination.textContent = '';
    if (target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="page">${i}</a></li>`
        }
    }
};

{
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
};

// Поиск

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);    
    }
    searchFormInput.value = '';
});



//  открытие модального окна

tvShowList.addEventListener('click', event => {
    event.preventDefault(); 
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {
        new DBService().getTvShows(card.id)
            .then(({
                poster_path: posterPatch, 
                name: title, 
                genres, 
                vote_average: voteAverage, 
                overview, 
                homepage}) => {
                
                tvCardImg.src = IMG_URL + posterPatch;
                tvCardImg.alt = title;
                modalTitle.textContent = title;
                genresList.textContent = '';
                genres.forEach(item => { genresList.innerHTML += `<li>${item.name}</li>`; });
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.textContent = homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
    }
});

//закрытие модульного окна

modal.addEventListener('click', event => {
    console.log(event.target.closest('.cross'));
    if (event.target.closest('.cross') || 
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide')
    }
});

pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('page')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
});

// смена карточки
const chanheImage = event => {
    const card = event.target.closest('.tv-show__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};
tvShowList.addEventListener('mouseover', chanheImage);
tvShowList.addEventListener('mouseout', chanheImage);

