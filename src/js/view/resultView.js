import View from "./View.js";
import PreviewView from "./previewView.js";
import RecipeView from "./recipeView.js";

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try another one.';
  _searchResultsTrigger = document.querySelector('.search-results-trigger');
  _skipToRecipe = document.querySelector('.skip-to-recipe__cta');
  _isSearchResultsTriggerEventAttached = false;
  
  constructor() {
    super();
    this.toggleRecipeSearchResult();
    this.handleSkipToRecipeCta();
  }
  
  /**
   * Generate search result markup
   *
   * @returns {string}
   * @private
   */
  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
  
  /**
   * Toggle search result section visibility
   *
   * @param {boolean} force
   */
  toggleRecipeSearchResult(force = false) {
    const self = this;
    const activeClass = 'active';
    
    // Toggle search result section active class and aria-hidden attribute value
    const toggleRecipeSearchResultSection = () => {
      self._searchResultsTrigger.classList.toggle(activeClass);
      self._parentElement.parentElement.classList.toggle(activeClass);
      self._parentElement.parentElement.setAttribute('aria-hidden', !self._parentElement.parentElement.classList.contains(activeClass));
    }
    
    force && toggleRecipeSearchResultSection();
    
    if (this._isSearchResultsTriggerEventAttached) return;
    self._isSearchResultsTriggerEventAttached = true;
    self._searchResultsTrigger.addEventListener('click', () => {
      toggleRecipeSearchResultSection()
    });
    
    // Toggle accessibility attributes based on screen width
    const mql = window.matchMedia(`(min-width: 980px)`);
    self._parentElement.parentElement.setAttribute('aria-modal', !mql.matches);
    !mql.matches && self._parentElement.parentElement.setAttribute('aria-hidden', 'true');
    
    mql.addEventListener('change', function(m) {
      self._parentElement.parentElement.setAttribute('aria-modal', !m.matches);
      m.matches
        ? self._parentElement.parentElement.removeAttribute('aria-hidden')
        : self._parentElement.parentElement.setAttribute('aria-hidden', !self._parentElement.parentElement.classList.contains(activeClass));
    })
  }
  
  /**
   * Handle skip to recipe view cta button click
   */
  handleSkipToRecipeCta() {
    this._skipToRecipe.addEventListener('click', RecipeView.trapFocusToRecipeView.bind(RecipeView));
  }
}

export default new ResultView();