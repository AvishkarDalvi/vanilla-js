// control variables
const imageLink = "https://www.themoviedb.org/t/p/w440_and_h660_face";
let currentPage = 1;
const limit = 10;
let total = 0;
var fetchURL;
getSearch();

//this function checks if the search query has been entered and sets the search or the default url accordingly
function getSearch() {
	let searchedVal = document.getElementById("search-box").value;
	if (searchedVal.length > 0) {
		fetchURL = "https://api.themoviedb.org/3/search/movie?api_key=50abfd6ea4dfae3d8f95be50a06763e0&language=en-US&query=" + searchedVal;
	}
	else {
		fetchURL = "https://api.themoviedb.org/3/movie/top_rated?api_key=50abfd6ea4dfae3d8f95be50a06763e0&language=en-US";
	}

}

//this function is called on reset click it calls the default url and sets the current page to 1 to start the list from page 1
function RefetchList() {
	document.getElementById("grid-list").innerHTML = "";
	getSearch();
	currentPage = 1;
	loadMovies(currentPage, limit);
}

const element = document.querySelector('form');
element.addEventListener('submit', event => {
	event.preventDefault();
	RefetchList();
});


const moviesEl = document.querySelector('.quotes');
const loaderEl = document.querySelector('.loader');

// get the movies from API
const getMovies = async (page, limit) => {
	const API_URL = `${fetchURL}&page=${page}`;
	const response = await fetch(API_URL);
	// handle 404
	if (!response.ok) {
		throw new Error(`An error occurred: ${response.status}`);
	}
	return await response.json();
}

// show the movies
const showMovies = (movies) => {
	movies.forEach(movie => {
		const movieEl = document.createElement('li');
		movieEl.innerHTML = `
            <div style="background-image: url('${imageLink}${movie.poster_path}');"></div>
        `;

		moviesEl.appendChild(movieEl);
	});
};

const hideLoader = () => {
	loaderEl.classList.remove('show');
};

const showLoader = () => {
	loaderEl.classList.add('show');
};

const hasMoreMovies = (page, limit, total) => {
	const startIndex = (page - 1) * limit + 1;
	return total === 0 || startIndex < total;
};

// load movies
const loadMovies = async (page, limit) => {

	// show the loader
	showLoader();

	// 0.5 second later
	setTimeout(async () => {
		try {
			// if having more movies to fetch
			if (hasMoreMovies(page, limit, total)) {
				// call the API to get movies
				const response = await getMovies(page, limit);
				// show movies
				showMovies(response.results);
				// update the total
				total = response.total_results;
			}
		} catch (error) {
			console.log(error.message);
		} finally {
			hideLoader();
		}
	}, 500);

};



window.addEventListener('scroll', () => {
	const {
		scrollTop,
		scrollHeight,
		clientHeight
	} = document.documentElement;

	if (scrollTop + clientHeight >= scrollHeight - 100 &&
		hasMoreMovies(currentPage, limit, total)) {
		currentPage++;
		loadMovies(currentPage, limit);
	}
}, {
	passive: true
});

// initialize
loadMovies(currentPage, limit);