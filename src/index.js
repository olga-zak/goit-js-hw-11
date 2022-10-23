'use strict';
//console.log(2);
//const axios = require('axios');
const axios = require('axios').default;
//import simpleLightbox from 'simplelightbox';
//import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

//const searchBtnRef = document.querySelector('.search-btn'); //повесить на форму слушателя сабмит??

// HTTP - запросы
// В качестве бэкенда используй публичный API сервиса Pixabay https://pixabay.com/api/docs/
//     Зарегистрируйся, получи свой уникальный ключ доступа ( 30721713-dc13b7587189df7eaf911ae19 ) и ознакомься с документацией.
// Список параметров строки запроса которые тебе обязательно необходимо указать:
//    + key - твой уникальный ключ доступа к API.
//     q - термин для поиска.То, что будет вводить пользователь.
//    + image_type - тип изображения.Мы хотим только фотографии, поэтому задай значение photo.
//    + orientation - ориентация фотографии.Задай значение horizontal.
//    + safesearch - фильтр по возрасту.Задай значение true.
// В ответе будет массив изображений удовлетворивших критериям параметров запроса.
// Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:
//     + webformatURL - ссылка на маленькое изображение для списка карточек.
//     + largeImageURL - ссылка на большое изображение.
//     + tags - строка с описанием изображения.Подойдет для атрибута alt.
//     + likes - количество лайков.
//     + views - количество просмотров.
//     + comments - количество комментариев.
//     + downloads - количество загрузок.
// Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло.В таком случае показывай
// уведомление с текстом "Sorry, there are no images matching your search query. Please try again.".
// Для уведомлений используй библиотеку notiflix. https://github.com/notiflix/Notiflix#readme

// https://pixabay.com/api/?key=30721713-dc13b7587189df7eaf911ae19&q=yellow+flowers&image_type=photo&pretty=true
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30721713-dc13b7587189df7eaf911ae19';

let pageToFetch = 1;
let searchword = '';
//const params =
//  '&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true'; //yellow+flowers &q=yellow+flowers - это то что пользователь вводит в поиск !!! если 2 и более слов, то через + написаны
function fetchImages(page, searchword) {
  const params = new URLSearchParams({
    q: searchword,
    per_page: 50,
    page: page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  return fetch(`${BASE_URL}?key=${API_KEY}&${params}`)
    .then(response => {
      if (!response.ok) {
        console.log('error mfk');
        throw new Error(response.status);
      }
      return response.json(); //Promise
    })
    .catch(error => console.log(error));
}

function getImages(page, searchword) {
  fetchImages(page, searchword).then(data => {
    console.log(data.hits);
    console.log(data.hits.length);

    // const images = data.hits;

    //если вбить котиков, а потом абракадабру, то кнопка loadMoreBtn остаётся -- убрать бы надо
    //убирается, но перед этим на мгновение появляется --- исправить бы
    if (data.hits.length === 0) {
      loadMoreBtn.classList.add('invisible');
      // return;
    }
    const images = data.hits;
    renderImages(images);

    if (pageToFetch === Math.ceil(data.totalHits / 50)) {
      loadMoreBtn.classList.add('invisible');
      return;
    }

    pageToFetch += 1;

    if (data.totalHits / 50 > 1) {
      loadMoreBtn.classList.remove('invisible');
    }
  });
}
//baby doll запрос выдаёт 122 картинки.

function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" width=320 height=213 loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

formRef.addEventListener('submit', onFormSubmit);
function onFormSubmit(event) {
  event.preventDefault();
  const query = event.target.elements.searchQuery.value;
  searchword = query;
  pageToFetch = 1;
  galleryRef.innerHTML = '';
  //if(!query) то же самое что и if (query === '')
  if (query === '') {
    //loadMoreBtn.classList.add('invisible');
    return;
  }
  getImages(pageToFetch, query);
}

loadMoreBtn.addEventListener('click', () => {
  getImages(pageToFetch, searchword);
});
