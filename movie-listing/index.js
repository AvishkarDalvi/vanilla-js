// control variables
const imageLink = "https://www.themoviedb.org/t/p/w440_and_h660_face";
let currentPage = 1;
const limit = 10;
let total = 0;
var fetchURL;
getSearch();

function getSearch() {
	let searchedVal = document.getElementById("search-box").value;
	if (searchedVal.length > 0) {
		fetchURL = "https://api.themoviedb.org/3/search/movie?api_key=50abfd6ea4dfae3d8f95be50a06763e0&language=en-US&query=" + searchedVal;
	}
	else {
		fetchURL = "https://api.themoviedb.org/3/movie/top_rated?api_key=50abfd6ea4dfae3d8f95be50a06763e0&language=en-US";
	}

}
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


const quotesEl = document.querySelector('.quotes');
const loaderEl = document.querySelector('.loader');

// get the quotes from API
const getMovies = async (page, limit) => {
	const API_URL = `${fetchURL}&page=${page}`;
	const response = await fetch(API_URL);
	// handle 404
	if (!response.ok) {
		throw new Error(`An error occurred: ${response.status}`);
	}
	return await response.json();
}

// show the quotes
const showMovies = (quotes) => {
	quotes.forEach(quote => {
		const quoteEl = document.createElement('li');
		quoteEl.classList.add('quote');
		quoteEl.innerHTML = `
            <div style="background-image: url('${imageLink}${quote.poster_path}');"></div>
        `;

		quotesEl.appendChild(quoteEl);
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

// load quotes
const loadMovies = async (page, limit) => {

	// show the loader
	showLoader();

	// 0.5 second later
	setTimeout(async () => {
		try {
			// if having more quotes to fetch
			if (hasMoreMovies(page, limit, total)) {
				// call the API to get quotes
				const response = await getMovies(page, limit);
				// show quotes
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