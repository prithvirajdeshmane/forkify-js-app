import { API_KEY, API_URL } from './config.js';
import { PAGINATION_RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    searchResults: [],
    resultsPerPage: PAGINATION_RESULTS_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};

const _createRecipeObject = function (resJson) {
  const { recipe } = resJson.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const resJson = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = _createRecipeObject(resJson);

    // if a recipe has been bookmarked we need to show the bookmark 'filled' icon
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // consosle.log(state.recipe);
  } catch (error) {
    // console.error(`😭😭😭${error}`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const resJson = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    const results = resJson.data.recipes;
    // console.log(results);
    state.search.searchResults = results.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search);

    // When a new search is loaded, set results page to 1
    state.search.currentPage = 1;
  } catch (error) {
    console.error(`😭😭😭${error}`);
    throw error;
  }
};

// loadSearchResults();

export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.searchResults.slice(start, end);
};

export const updateServings = function (newServingSize) {
  const delta = newServingSize / state.recipe.servings;
  // console.log(`DELTA: ${delta}`);

  // console.log(state.recipe.ingredients);

  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= delta;
  });

  state.recipe.servings = newServingSize;
};

const persistBookmarksData = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmarkToRecipe = function (recipe) {
  // Add recipe to bookmarks array
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //Update local storage for bookmarks
  persistBookmarksData();
};

export const deleteBookmark = function (id) {
  // Delete bookmark from bookmarks array
  const index = state.bookmarks.findIndex(item => item.id === id);
  state.bookmarks.splice(index, 1);

  // Remove bookmarked flags
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //Update local storage for bookmarks
  persistBookmarksData();
};

//To load existing local storage bookmarks data on page load
const init = function () {
  const storedBookmarks = localStorage.getItem('bookmarks');
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
};
init();
// console.log(state.bookmarks);

// DEVELOPER TESTING FUNCTION TO CLEAR BOOKMARKS
// DISABLE INIT BEFORE CALLING
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

const _createUploadRecipeObject = function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingdsArray = ing[1].replaceAll(' ', '').split(',');
        const ingdsArray = ing[1].split(',').map(elem => elem.trim());
        if (ingdsArray.length !== 3)
          throw new Error(
            'Wrong ingredients format, please correct entry as per required format'
          );

        const [quantity, unit, description] = ingdsArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    return {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
  } catch (error) {
    throw error;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const recipe = _createUploadRecipeObject(newRecipe);
    const sendDataResp = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // console.log(sendDataResp);
    state.recipe = _createRecipeObject(sendDataResp);
    addBookmarkToRecipe(state.recipe);
  } catch (error) {
    throw error;
  }
};
