import {API_URL, API_KEY, RESULTS_PER_PAGE, BOOKMARKS_STORAGE_KEY} from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE
  },
  bookmarks: []
}

/**
 * Create recipe object
 *
 * @param {object} data
 * @returns {{}|{sourceUrl: string, image: string, servings: number, publisher: string, ingredients: array, id: string, title: string, cookingTime: number}}
 */
const createRecipeObject = function (data) {
  if (!data?.recipe) return {};
  const { recipe } = data;
  
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
}

/**
 * Fetch recipe data
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export const loadRecipe = async function (id) {
  if (!id) return;

  try {
    const recipeResponseData = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(recipeResponseData.data)
    
    state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === id);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Load search results data
 *
 * @param {string} query
 * @returns {Promise<void>}
 */
export const loadSearchResults = async function(query) {
  if (!query) throw new Error('Please specify a query and try again.');
  
  state.search.query = query;
  
  try {
    const recipeSearchResultsData = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.page = 1;
    state.search.results = recipeSearchResultsData.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      }
    })
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Return the right amount of search result recipes per page
 *
 * @param {number} page
 * @returns {*[]}
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  
  return state.search.results.slice(start, end);
}

/**
 * Update servings data
 *
 * @param {number} newServings
 */
export const updateServings = function (newServings) {
  if (!newServings) return;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
  });
  
  state.recipe.servings = newServings;
}

/**
 * Add/Delete bookmark
 *
 * @param {object} recipe
 */
export const manageBookmark = function (recipe) {
  // Check if recipe already bookmarked
  const bookmarkedId = state.bookmarks.findIndex(bookmarkedRecipe => bookmarkedRecipe.id === recipe.id);
  const isBookmarked = bookmarkedId !== -1;
  if (isBookmarked) {
    // Delete bookmark
    state.bookmarks.splice(bookmarkedId, 1);
  } else {
    // Add bookmark
    state.bookmarks.push(recipe);
  }
  
  // Mark/Unmark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = !isBookmarked;
  
  // Save to localstorage
  persistBookmarks();
}

/**
 * Save bookmarks to localstorage
 */
const persistBookmarks = function () {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(state.bookmarks));
}

/**
 * Load stored bookmarks
 * @returns {*[]}
 */
const loadBookmarks = function () {
  const bookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
  return bookmarks ? JSON.parse(bookmarks) : [];
}

/**
 * Upload new recipe
 *
 * @param {object} newRecipe
 * @returns {Promise<void>}
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredien') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please follow the correct format.')
        
        const [ quantity, unit, description ] = ingArr;
        
        if (ingArr.length === 3 && !description)
          throw new Error('The description is required! Please specify the description.');
        
        return {
          quantity: quantity ? +quantity : '',
          unit: unit ? unit : '',
          description
        };
      });
    
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.source_url,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cooking_time,
      ingredients
    }
    
    // Upload new recipe
    const responseData = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(responseData.data);
    
    // Add new recipe to bookmark
    manageBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

const init = function () {
  // Load stored bookmarks
  state.bookmarks = loadBookmarks();
}

init();