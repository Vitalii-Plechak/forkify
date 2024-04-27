import { MODAL_CLOSE_TIME, MOBILE_EDGE } from "./config";
import * as model from './model.js';
import RecipeView from "./view/recipeView.js";
import SearchView from "./view/searchView.js";
import ResultView from "./view/resultView.js";
import PaginationView from "./view/paginationView.js";
import BookmarksView from "./view/bookmarksView.js";
import AddRecipeView from "./view/addRecipeView.js";

/**
 * Load and render recipe
 *
 * @returns {Promise<void>}
 */
const controlRecipes = async function () {
  try {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;
    RecipeView.renderSpinner();
    
    // 1) Update results view to mark selected search results
    ResultView.update(model.getSearchResultsPage());
    
    // 2) Load recipe
    await model.loadRecipe(hashId);

    // 3) Render recipe
    RecipeView.render(model.state.recipe);
    
    // 4) Update bookmarks
    BookmarksView.update(model.state.bookmarks);
  } catch (err) {
    RecipeView.renderErrorMessage();
  }
};

/**
 * Update the recipe view
 *
 * @param {number} servingsQty
 */
const controlServings = function(servingsQty) {
  // 1) Update recipe
  model.updateServings(servingsQty);
  
  // 2) Render recipe
  RecipeView.update(model.state.recipe);
}

/**
 * Prepare and render search results page and pagination
 *
 * @returns {Promise<void>}
 */
const controlSearchResults = async function() {
  try {
    ResultView.renderSpinner();
    
    // 1) Get search query and load search results
    await model.loadSearchResults(SearchView.getQuery());
    
    // 2) Render search results
    ResultView.render(model.getSearchResultsPage());
    
    // 3) Render pagination
    PaginationView.render(model.state.search);
    
    // 4) Open search result section on mobile
    if (window.innerWidth < MOBILE_EDGE) ResultView.toggleRecipeSearchResult(true);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Render updated pagination
 *
 * @param {number} page
 */
const controlPagination = function (page) {
  // 1) Render new search results
  ResultView.render(model.getSearchResultsPage(page));
  
  // 3) Render new pagination
  PaginationView.render(model.state.search);
}

/**
 * Control bookmarks (add/delete them)
 */
const controlManageBookmark = function () {
  // 1) Add/Remove bookmark
  model.manageBookmark(model.state.recipe);
  // 2) Update recipe view
  RecipeView.update(model.state.recipe);
  // 3) Render bookmark
  BookmarksView.render(model.state.bookmarks);
}

/**
 * Add new recipe
 *
 * @param {object} newRecipe
 * @returns {Promise<void>}
 */
const controlAddNewRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    AddRecipeView.renderSpinner();
    
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    
    // Render new recipe
    RecipeView.render(model.state.recipe);
    
    // Show success message
    AddRecipeView.renderMessage();
    
    // Render bookmark
    BookmarksView.update(model.state.bookmarks);
    
    // Change ID the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
    // Close new recipe form window
    setTimeout(e => AddRecipeView.toggleNewRecipeWindow(e, true), MODAL_CLOSE_TIME * 1000);
  } catch (err) {
    AddRecipeView.renderErrorMessage(err.message);
  }
}

const init = function () {
  BookmarksView.render(model.state.bookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerManageBookmark(controlManageBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerRecipeUpload(controlAddNewRecipe);
}

init();