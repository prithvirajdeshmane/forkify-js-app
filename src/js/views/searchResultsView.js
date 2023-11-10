import View from './View.js';
import previewView from './previewView.js';
//import icons from 'url:../../img/icons.svg';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'No recipes found for your query. Please search for another recipe';

  _generateMarkup() {
    return this._data
      .map(searchResult => previewView.render(searchResult, false))
      .join('');
  }
}

export default new SearchResultsView();
