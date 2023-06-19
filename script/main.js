const apiKey = 'dfe3518509msha641d453af9105cp1ceb99jsn243c62d5e1da';
const searchButton = document.getElementById('search-button');
const favoritesButton = document.getElementById('favorites-button');
const searchContainer = document.getElementById('search-container');
const favoritesContainer = document.getElementById('favorites-container');
const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const favoritesList = document.getElementById('favorites-list');
let favorites = [];

if (localStorage.getItem('favorites')) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
    displayFavorites();
}

searchButton.addEventListener('click', function () {
    searchContainer.style.display = 'block';
    favoritesContainer.style.display = 'none';
});

favoritesButton.addEventListener('click', function () {
    searchContainer.style.display = 'none';
    favoritesContainer.style.display = 'block';
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchQuery = searchInput.value;
    const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${searchQuery}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey
        }
    })
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = '';

            const searchResults = data.data;

            searchResults.forEach(result => {
                const songTitle = result.title;
                const albumTitle = result.album.title;
                const duration = result.duration;
                const coverImage = result.album.cover_medium;
                const trackId = result.id;

                const resultElement = document.createElement('div');
                resultElement.innerHTML = `
                <div class="song-item">
                  <img src="${coverImage}" alt="Cover Image">
                  <div class="song-details">
                    <h3>${songTitle}</h3>
                    <p>Альбом: ${albumTitle}</p>
                    <p>Тривалість: ${duration} сек</p>
                    <button class="like-button" data-track-id="${trackId}">Лайк</button>
                  </div>
                </div>
              `;

                resultsContainer.appendChild(resultElement);
            });

            const likeButtons = document.querySelectorAll('.like-button');
            likeButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const trackId = button.getAttribute('data-track-id');
                    likeTrack(trackId);
                });
            });
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
});

function likeTrack(trackId) {
    const likedSong = favorites.find(song => song.trackId === trackId);
    if (likedSong) {
        alert('Пісня вже в списку вподобань');
    } else {
        const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/track/${trackId}`;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                const songTitle = data.title;
                const albumTitle = data.album.title;
                const duration = data.duration;
                const coverImage = data.album.cover_medium;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                <div class="song-item">
                  <img src="${coverImage}" alt="Cover Image">
                  <div class="song-details">
                    <h3>${songTitle}</h3>
                    <p>Альбом: ${albumTitle}</p>
                    <p>Тривалість: ${duration} сек</p>
                    <button class="remove-button" data-track-id="${trackId}">Видалити</button>
                  </div>
                </div>
              `;

                favoritesList.appendChild(listItem);
                favorites.push({ trackId, songTitle, albumTitle, duration, coverImage });
                saveFavorites();

                const removeButtons = document.querySelectorAll('.remove-button');
                removeButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const trackId = button.getAttribute('data-track-id');
                        removeSong(trackId);
                    });
                });
            })
            .catch(error => {
                console.error('Помилка:', error);
            });
    }
}

function removeSong(trackId) {
    favorites = favorites.filter(song => song.trackId !== trackId);
    saveFavorites();
    displayFavorites();
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function displayFavorites() {
    favoritesList.innerHTML = '';

    favorites.forEach(song => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="song-item">
              <img src="${song.coverImage}" alt="Cover Image">
              <div class="song-details">
                <h3>${song.songTitle}</h3>
                <p>Альбом: ${song.albumTitle}</p>
                <p>Тривалість: ${song.duration} сек</p>
                <button class="remove-button" data-track-id="${song.trackId}">Видалити</button>
              </div>
            </div>
          `;

        favoritesList.appendChild(listItem);
    });

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = button.getAttribute('data-track-id');
            removeSong(trackId);
        });
    });
}