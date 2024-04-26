class SearchView {
  _parentElement = document.querySelector('.search');
  _searchInput = this._parentElement.querySelector('.search__field');
  _matchMediaAttached = false;
  
  /**
   * Get search query
   *
   * @param {boolean} clearInput
   * @returns {*}
   */
  getQuery(clearInput = true) {
    const query = this._searchInput.value.trim();
    clearInput && this._clearInput();
    return query;
  }
  
  /**
   * @param {Function} handler
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      
      this._handleMobileSearch();
      this.getQuery(false) && handler();
    })
  }
  
  /**
   * Clear input
   */
  _clearInput() {
    this._searchInput.value = '';
  }
  
  /**
   * Handle search visibility on mobile
   *
   * @returns {(function(): void)|void}
   * @private
   */
  _handleMobileSearch() {
    if (!this._searchInput) return;
    
    const self = this;
    const activeClass = 'active';
    const mobileEdge = 980;
    
    // Toggle active class and aria-hidden attribute
    if (window.innerWidth < mobileEdge) {
      self._searchInput.classList.toggle(activeClass);
      self._searchInput.setAttribute('aria-hidden', !self._searchInput.classList.contains(activeClass));
    }
    
    if (this._matchMediaAttached) return;
    
    return () => {
      this._matchMediaAttached = true;
      
      // Remove active class and aria-hidden attribute based on matchMedia condition
      const matchMedia = window.matchMedia(`(min-width: ${mobileEdge}px)`);
      matchMedia.addEventListener('change', function(m) {
        if (m.matches) {
          self._searchInput.classList.remove(activeClass);
          self._searchInput.removeAttribute('aria-hidden');
        }
      })
    }
  }
}

export default new SearchView();