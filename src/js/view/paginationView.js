import View from "./View.js";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  
  /**
   * @param {Function} handler
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (btn) {
        handler(+btn.dataset.goto);
      }
    })
  }
  
  /**
   * Generate pagination markup
   *
   * @returns {string}
   * @private
   */
  _generateMarkup() {
    const numPages = Math.floor(this._data.results.length / this._data.resultsPerPage);
    const currentPage = this._data.page;
    
    /* page 1 and other pages */
    if (currentPage === 1 && numPages > 1) {
      return this._generateNextButton(currentPage + 1);
    }
    
    /* last page */
    if (currentPage >= numPages && numPages > 1) {
      return this._generatePrevButton(currentPage - 1);
    }
    
    /* other pages */
    if (currentPage < numPages) {
      return `
        ${this._generatePrevButton(currentPage - 1)}
        ${this._generateNextButton(currentPage + 1)}
      `;
    }
    
    /* page 1, and there are no other pages */
    return '';
  }
  
  /**
   * Generate previous button markup
   *
   * @param {number} page
   * @returns {string}
   * @private
   */
  _generatePrevButton(page) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page}</span>
      </button>
    `;
  }
  
  /**
   * Generate next button markup
   *
   * @param {number} page
   * @returns {string}
   * @private
   */
  _generateNextButton(page) {
   return `
      <button data-goto="${page}" class="btn--inline pagination__btn--next">
        <span>Page ${page}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();