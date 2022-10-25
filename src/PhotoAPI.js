'use strict';
console.log(2);
class PhotosAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static #API_KEY = '30721713-dc13b7587189df7eaf911ae19'; //приватное свойство - private property
  pageToFetch = 1;
  constructor(searchword = '') {
    this.searchword = searchword;
  }
  async fetchPhotos() {
    const params = new URLSearchParams({
      //q: searchword,
      q: this.searchword,
      per_page: 50,
      page: this.pageToFetch, //Returned search results are paginated. Use this parameter to select the page number. Default: 1
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    // https://pixabay.com/api/?key=30721713-dc13b7587189df7eaf911ae19&q=yellow+flowers&image_type=photo&pretty=true

    const result = await fetch(`${BASE_URL}?key=${API_KEY}&${params}`); //асинхронная функция всегда возвращает Promise
    return result.ok ? result.json() : Promise.reject(result.statusText); //if запрос прошел успешно (т.е. "result.ok") do(return) result.json(), if not - Promise.reject(result.statusText) отловим потом в .catch
  }

  resetPage() {
    this.pageToFetch = 0;
    console.log('launched class metod resetPage {this.pageToFetch=0}');
  }

  get searchword() {
    return this.searchword;
  }
  set searchword(value) {
    this.searchword = value;
  }
}

export { PhotoAPI };
