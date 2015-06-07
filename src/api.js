var baseUrl = 'http://www.omdbapi.com/'

function getJson(params) {
  var serializedParams = Object.keys(params)
    .map(k => k + '=' + encodeURIComponent(params[k]))
    .join('&');
  return fetch(baseUrl + '?' + serializedParams)
    .then(response => response.json());
}

function ensureArray(value) {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return [value];
  }

  return value;
}

function convertSeries(series) {
  return {
    year: series.Year,
    id: series.imdbID,
    title: series.Title,
  };
}

var cachedSearches = {};

export function search(query) {
  if (query in cachedSearches) {
    return Promise.resolve(cachedSearches[query]);
  }

  return getJson({s: query, type: 'series'})
    .then(data => {
      var result = ensureArray(data.Search)
        .map(convertSeries)
        // Dedupe
        .filter((series, i, all) => i === 0 || series.id !== all[i - 1].id);

      cachedSearches[query] = result;

      return result;
    });
}
