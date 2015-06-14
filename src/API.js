const baseUrl = 'http://api.tvmaze.com/';

const cachedResponses = {};

function getJson(path, params = {}) {
  const serializedParams = Object.keys(params)
    .map(k => k + '=' + encodeURIComponent(params[k]))
    .join('&');
  const url = baseUrl + path + '?' + serializedParams;

  if (url in cachedResponses) {
    return Promise.resolve(cachedResponses[url]);
  }

  cachedResponses[url] = fetch(url)
    .then(response => response.json())
    .then(json => {
      cachedResponses[url] = json;
      return json;
    });

  return cachedResponses[url];
}

function translateShow(show) {
  return {
    id: show.id,
    imageURL: show.image.medium,
    name: show.name,
    year: show.premiered.split('-')[0],
  };
}

export function search(query) {
  return getJson('search/shows/', {q: query})
    .then(data => data.map(result => translateShow(result.show)));
}

function translateEpisode(episode) {
  return {
    airDate: episode.airdate,
    episodeNumber: episode.number,
    id: episode.id,
    imageURL: episode.image && episode.image.medium,
    name: episode.name,
    seasonNumber: episode.season,
    summary: episode.summary.replace(/<\/?[a-z]+ ?\/?>/g, ''),
  };
}

export function getEpisodes(showID) {
  return getJson(`shows/${showID}/episodes`)
    .then(data => data.map(translateEpisode));
}
