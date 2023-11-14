import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js'; 
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio'; 

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  err: document.querySelector('.error'), 
  catCard: document.querySelector('.cat-info'),
};

refs.loader.style.display = 'none';
refs.err.style.display = 'none';
refs.select.style.display = 'none';
refs.catCard.style.display = 'none';


fetchBreeds()
  .then(data => {
    refs.select.style.display = 'flex';
    refs.loader.style.display = 'none';

    createMarkupOptions(data);

    new SlimSelect({
      select: refs.select,
    });
  })
  .catch(err => {
    Notify.failure(refs.err.textContent);
  })
  .finally(result => Loading.remove());

function createMarkupOptions(arr) {
  return arr
    .map(({ id, name }) => {
      console.log({ id, name });

      const option = `<option value=${id}>${name}</option>`;
      refs.select.insertAdjacentHTML('beforeend', option);
    })
    .join('');
}

refs.select.addEventListener('change', e => {
  const id = e.target.value;

  fetchCatByBreed(id)
    .then(catInfo => {
      refs.catCard.style.display = 'flex';
      createMarkupCards(catInfo);
    })
    .catch(err => {
      refs.loader.style.display = 'none';
      refs.select.style.display = 'none';
      refs.catCard.style.display = 'none';
      Notify.failure(refs.err.textContent);
    })
    .finally(result => Loading.remove());
});

function createMarkupCards(data) {
  const {
    breeds: { name, description, temperament },
    url,
  } = data;
  
  const card = ` 
      <img class="cat-img" src="${url}" alt="${data.breeds[0].name}"  >
      <div class="cat-right">
      <h1 class="name">${data.breeds[0].name}</h1>
      <p class="description">${data.breeds[0].description}</p>
      <p class="temperament"><span class="temperament-span">Temperament:</span> ${data.breeds[0].temperament}</p>    
      </div>`;
  refs.catCard.innerHTML = card;
}