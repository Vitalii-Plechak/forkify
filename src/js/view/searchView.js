class SearchView {
  _parentElement = document.querySelector('.search');
  _searchInput = this._parentElement.querySelector('.search__field');
  
  /**
   * Get search query
   *
   * @returns {string}
   */
  getQuery() {
    const query = this._searchInput.value.trim();
    this._clearInput();
    return query;
  }
  
  /**
   * @param {Function} handler
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    })
  }
  
  /**
   * Clear input
   */
  _clearInput() {
    this._searchInput.value = '';
  }
}

export default new SearchView();