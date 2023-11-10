//import icons from '../img/icons.svg'; // Parcel 1 code
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// IMPORTS FOR MVC ARCHITECTURE
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationButtonsView from './views/paginationButtonsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SECONDS } from './config.js';

// API CREATED BY JONAS: https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // If user selects recipe, or page loads with id, then grab the recipe id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // show spinner while we load
    recipeView.renderSpinner();

    // STEP 0: UPDATE RESULTS VIEW TO MARK selected RESULTS
    // STEP 0.1: UPDATE BOOKMARKS VIEW TO MARK selected RECIPE
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // STEP 1: LOADING THE RECIPE
    await model.loadRecipe(id);

    // STEP 2: RENDERING THE RECIPE
    recipeView.render(model.state.recipe);

    // OPTIONAL: DISPLAY STATE IN CONSOLE
    // console.log(model.state);

    // TEST CHANGING SERVING
    // controlServings();
    // debugger;
    // bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    // alert(error);
    recipeView.renderError();
    console.error(error);
  }
};
// showRecipe();

// MULTIPLE SIMILAR EVENTLISTENERS DOING THE SAME THING CAN BE COMBINED AS SHOWN BELOW
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

// ['hashchange', 'load'].forEach(event =>
//   window.addEventListener(event, controlRecipes)
// );

// Searching
const controlSearchResults = async function () {
  try {
    searchResultsView.renderSpinner();
    // console.log(searchResultsView);

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Fetch search results
    await model.loadSearchResults(query);

    // 3. Render results
    // console.log(model.state.search.searchResults);
    // searchResultsView.render(model.state.search.searchResults);
    searchResultsView.render(model.getSearchResultsPage());
    paginationButtonsView.render(model.state.search);
  } catch (error) {
    searchResultsView.renderError();
    console.error(error);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  // Now we want the following things to happen:
  // 1. We need to load the search results corresponding to this page Number
  // 2. We want to show the new pagination button numbers
  searchResultsView.render(model.getSearchResultsPage(goToPage));
  paginationButtonsView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings in model state
  // This task is to be delegated to the model
  model.updateServings(newServings);

  //  Update recipe view with new serving sizes
  // recipeView.render(model.state.recipe); // Render method reloads the recipe view. Updating only where necessary is a better approach
  recipeView.update(model.state.recipe);
};
// controlServings();

// Add new bookmark
const controlAddBookmarkToRecipe = function () {
  // 1. Add or remove bookmark (icon)
  if (!model.state.recipe.bookmarked)
    model.addBookmarkToRecipe(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);

  // 2. Update Recipe view with bookmark icon marked or unmarked
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks in bookmark panel
  bookmarksView.render(model.state.bookmarks);
};

// Load existing bookmarks from local storage
const controlLoadBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render the bookmark panel view
    bookmarksView.render(model.state.bookmarks);

    //Change URL of the page: change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.error(`#$%#$%# ${error}`);
    addRecipeView.renderError(error);
  }
};

/*
  Events and handlers in the MVC pattern are implemented via the Publisher-Subscriber architecture. The events have to be listened to in the View while the handler function has to be in the Controller.

  So, the Controller handler function is the Subscriber, and so the handler function name is passed as an argument to the listener in the View. 

  The View will have a function that listens to the events, and is the Publisher. 

  The functionality above is now updated to the Pub-Sub method, which will be setup in the init function below.
*/

const init = function () {
  bookmarksView.addHandlerRender(controlLoadBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarkToRecipe(controlAddBookmarkToRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationButtonsView.addHandlerButtonClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
};

init();
