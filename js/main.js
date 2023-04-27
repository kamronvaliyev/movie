const API_KEY = "ed23fc46";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const API_IMG = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const elForm = document.querySelector("[data-search-form]");
const elUl = document.querySelector("[data-ul]");
const elPagination = document.querySelector("[data-pagination]");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);
  const name = formData.get("name");
  searchMovie(name);
});

async function searchMovie(query) {
  elUl.innerHTML = "<li>Loading...</li>";
  const res = await fetch(`${API_URL}&s=${query}`);
  const searchResult = await res.json();

  renderMovie(searchResult.Search);
  // renderPagination(Math.ceil(+searchResult.totalResults / 10));
}

async function getMovie(movieId) {
  const res = await fetch(`${API_URL}&i=${movieId}`)

  return await res.json()
}

function renderMovie(movies) {
  elUl.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    const moviePosterUrl = movie.Poster === "N/A" ? "https://via.placeholder.com/200x300" : movie.Poster

    html += `<li><button type="button" data-info-btn="#modal-info" data-movie-id="${movie.imdbID}" >
        <img width="170" height="300" src="${moviePosterUrl}" alt="${movie.Title}" />
        <h3>"${movie.Title}"</h3></button>
        </li>`;  
  });
  elUl.innerHTML = html;
}

// function renderPagination(totalPage) {
//   elPagination.innerHTML = "";
//   let html = "";

//   for (let i = 1; i <= totalPage; i++) {
//     html += `<li><a href="?page=${i}>${i}</a></li>`;
//   }
//   elPagination.innerHTML = html;
// }

document.addEventListener("click", (evt) => {
  modalOpen(evt)
  onModalOutsideClick(evt);
  onModalCloseClick(evt);
});

function modalOpen(evt) {
  const el = evt.target.closest("[data-info-btn]")

  if (!el) return

  const modalSelector = el.dataset.infoBtn;
  const movieId = el.dataset.movieId
  const elModal = document.querySelector(modalSelector)

  fillModal(movieId)


  elModal.classList.add("show")
}

function onModalOutsideClick(evt) {
  const el = evt.target;

  if (!el.matches("[data-modal]")) return;


  el.classList.remove("show");
}

function onModalCloseClick(evt) {
  const el = evt.target.closest("[data-btn-close]");

  if (!el) return;

  el.closest("[data-modal]").classList.remove("show");
}

async function fillModal(movieId) {
  let movie = await getMovie(movieId);

  elContent = document.querySelector("[data-modal-content]")

  elContent.querySelector("[data-title-movie]").textContent = `Title: ${movie.Title}`;
  elContent.querySelector("[data-type-movie]").textContent = `Type: ${movie.Type}`;
  elContent.querySelector("[data-genre-movie]").textContent = `Genre: ${movie.Genre}`;
  elContent.querySelector("[data-direction]").textContent = `Direction: ${movie.Direction}`;
  elContent.querySelector("[data-year-movie]").textContent = `Year: ${movie.Year}`;
  elContent.querySelector("[data-id-movie]").textContent = `imdbID : ${movie.imdId} `;

  elContent.querySelector("[data-title-movie]").style.fontSize = "18px"
  elContent.querySelector("[data-type-movie]").style.fontSize = "16px"
  elContent.querySelector("[data-genre]").style.fontSize = "16px"
}
