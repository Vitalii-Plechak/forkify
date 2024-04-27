import View from "./View.js";
import PreviewView from "./previewView.js";
import RecipeView from "./recipeView.js";

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try another one.';
  _searchResultsTrigger = document.querySelector('.search-results-trigger');
  _skipToRecipe = '';
  _skipToRecipeEventAttached = false;
  _isSearchResultsTriggerEventAttached = false;
  
  constructor() {
    super();
    this.toggleRecipeSearchResult();
  }
  
  /**
   * Generate search result markup
   *
   * @returns {string}
   * @private
   */
  _generateMarkup() {
    (this._data.length && !this._skipToRecipe) && this._createSkipToRecipe();
    
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
  
  /**
   * Create, render and attach the event to the Skip to recipe button
   *
   * @private
   */
  _createSkipToRecipe() {
    if (this._skipToRecipe) return;
    this._parentElement.previousElementSibling.innerHTML = `<button class="skip-to-recipe__cta" type="button">Skip to recipe</button>`;
    this._skipToRecipe = document.querySelector('.skip-to-recipe__cta');
    this.handleSkipToRecipeCta();
  }
  
  /**
   * Toggle search result section visibility
   *
   * @param {boolean} forceOpen
   * @param {boolean} forceClose
   */
  toggleRecipeSearchResult(forceOpen = false, forceClose = false) {
    const self = this;
    const activeClass = 'active';
    
    /**
     *  Toggle recipe search result section active class and aria-hidden attribute value
     */
    const toggleRecipeSearchResultSection = () => {
      if (forceOpen) {
        self._searchResultsTrigger.classList.add(activeClass);
        self._parentElement.parentElement.classList.add(activeClass);
      } else if (forceClose) {
        self._searchResultsTrigger.classList.remove(activeClass);
        self._parentElement.parentElement.classList.remove(activeClass);
      } else {
        self._searchResultsTrigger.classList.toggle(activeClass);
        self._parentElement.parentElement.classList.toggle(activeClass);
      }
      
      self._parentElement.parentElement.setAttribute('aria-hidden', !self._parentElement.parentElement.classList.contains(activeClass));
    }
    
    (forceOpen || forceClose) && toggleRecipeSearchResultSection();
    
    if (this._isSearchResultsTriggerEventAttached) return;
    self._isSearchResultsTriggerEventAttached = true;
    // Toggle recipe search result section on menu button click
    self._searchResultsTrigger.addEventListener('click', toggleRecipeSearchResultSection);
    // Close recipe search result section on hashchange
    window.addEventListener('hashchange', () => this.toggleRecipeSearchResult(false, true));
    
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
    if (this._skipToRecipeEventAttached) return;
    
    this._skipToRecipeEventAttached = true;
    
    this._skipToRecipe.addEventListener('click', () => {
      RecipeView.trapFocusToRecipeView.call(RecipeView);
      if (window.innerWidth < 980) this.toggleRecipeSearchResult(false, true);
    });
  }
}

export default new ResultView();