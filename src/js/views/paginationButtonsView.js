import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationButtonsView extends View {
  _parentElement = document.querySelector('.pagination');

  _generatePrevPageButtonMarkup(currentPage) {
    return `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          currentPage - 1
        }">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
  }

  _generateNextPageButtonMarkup(currentPage) {
    return `
        <button class="btn--inline pagination__btn--next" data-goto="${
          currentPage + 1
        }">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.searchResults.length / this._data.resultsPerPage
    );

    // CASE ONLY ONE PAGE: We are on page 1 and there are no other pages, no pagination buttons should be seen
    if (this._data.currentPage === 1 && numPages === 1) {
      return ``;
    }

    // CASE MORE THAN 1 PAGES: We are on page 1 and there are other pages, only page 2 button should be seen
    if (this._data.currentPage === 1 && numPages > 1) {
      return this._generateNextPageButtonMarkup(this._data.currentPage);
    }

    // CASE: LAST PAGE : We are on the last page, so only button for previous page is seen
    if (numPages > 1 && this._data.currentPage === numPages) {
      return this._generatePrevPageButtonMarkup(this._data.currentPage);
    }

    // CASE: OTHER PAGE : Buttons should be seen for previous and next pages
    if (this._data.currentPage < numPages) {
      return (
        this._generatePrevPageButtonMarkup(this._data.currentPage) +
        this._generateNextPageButtonMarkup(this._data.currentPage)
      );
    }
  }

  addHandlerButtonClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedButtonElement = e.target.closest('.btn--inline');

      //guard clause to make sure this triggers only on button clicks
      // meaning: when white space is clicked nothing should happen
      // otherwise this triggers a null exception error in the console
      if (!clickedButtonElement) return;

      const goToPage = +clickedButtonElement.dataset.goto; //goto value is string so '+' converts it to a number

      handler(goToPage);
    });
  }
}

export default new PaginationButtonsView();

/*

<!-- <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page 1</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page 3</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button> -->

*/
