const cardContainer = document.getElementById('cardContainer');
const watchList = document.getElementById('dropPoint');
const watchListContainer = document.getElementById('watchListContent');
const genreSelect = document.getElementById('genre');
const titleSearch = document.getElementById('titleSearch');
const ratingSelect = document.getElementById('ratings');
var animeData = [];
var draggingElementId = -1;
const genres = new Set();

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function searchAnime() {
    var filteredCard = [];
    var searchFlag = false;
    animeData.map(item => {
        if(item.title.toLowerCase().trim() === titleSearch.value.toLowerCase().trim()) {
            filteredCard.push(item);
            searchFlag = true;
        }
    });

    if(filteredCard.length > 0) {
        while(cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.lastChild);
        }
        addCard(filteredCard);
    } else {
        titleSearch.style.color = 'red';
    }
}


const searchCard = debounce(() => {
    titleSearch.style.color = 'black';
    searchAnime()
});

function filterData(data) {
    data.map((item,idx) => {
        item.genres.map((genre,idx) => {
            genres.add(genre.name);
        })
    });
    var genreCount=0;
    genres.forEach(function(value,idx) {
        const option = document.createElement('option');
        option.value = genreCount;
        genreCount++;
        option.innerText = value;
        genreSelect.appendChild(option);
      })
}

function genreFilterCard(genreName) {
    if(genreName != 'All genre') {
        var filteredCards = [];
        animeData.map((item,idx) => {
            item.genres.map((genre,index) => {
                if(genre.name === genreName) {
                    filteredCards.push(item);
                }
            })
        })
        while(cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.lastChild);
        }

        addCard(filteredCards);
    } else {
        addCard(animeData);
    }
}

function ratingFilterCard(rating) {
    if(rating != 0) {
        var filteredCards = [];
        animeData.map((item) => {
            if(rating==1) {
                if(item.score <= 5) {
                    filteredCards.push(item)
                }
            } else if(rating==2) {
                if(item.score > 5 && item.score <=8 ) {
                    filteredCards.push(item)
                }
            } else if(rating==3) {
                if(item.score > 8) {
                    filteredCards.push(item)
                }
            }
        });
        while(cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.lastChild);
        }
        addCard(filteredCards);
    } else {
        addCard(animeData);
    }
}

function addCard(data) {
    data.map((item,idx) => {
        const card = document.createElement('div');
        card.draggable = true;
        card.classList.add("card");
        card.id = +idx;
        const cardContent = document.createElement('div');
        cardContent.classList.add("cardContent");
        const thumbnailContainer = document.createElement('a');
        thumbnailContainer.classList.add('animeThumbnail');
        const thumbnail = document.createElement('img');
        thumbnail.src = item.images.jpg.large_image_url;
        const cardDetailContainer = document.createElement('div');
        cardDetailContainer.classList.add('cardDetails');
        const cardDetalRowOne = document.createElement('div');
        const cardDetalRowTwo = document.createElement('div');
        cardDetalRowOne.classList.add('cardRow');
        cardDetalRowTwo.classList.add('cardRow');
        const animeTitle = document.createElement('h2');
        const watchListBtn = document.createElement('button');
        watchListBtn.classList.add("btn");
        watchListBtn.id = +idx;
        watchListBtn.innerText = 'Add to watchlist';
        watchListBtn.classList.add('btn');
        animeTitle.innerText = item.title;
        const genre = document.createElement('p');
        let gens = '';
        item.genres.map((genre,index) => {
            if(index==0) {
                gens  = gens.concat(`${genre.name}`);
            } else {
                gens  = gens.concat(`, ${genre.name}`);
            }
            
        })
        genre.innerText=`Genre: ${gens}`
        const rating = document.createElement('p');
        rating.innerText=`Rating : ${item.score}`;
        cardDetalRowOne.appendChild(animeTitle);
        cardDetalRowOne.appendChild(watchListBtn);
        cardDetalRowTwo.appendChild(genre);
        cardDetalRowTwo.appendChild(rating);
        thumbnailContainer.appendChild(thumbnail)
        cardDetailContainer.appendChild(cardDetalRowOne);
        cardDetailContainer.appendChild(cardDetalRowTwo);
        cardContent.appendChild(thumbnailContainer);
        cardContent.appendChild(cardDetailContainer);
        card.appendChild(cardContent);
        cardContainer.appendChild(card);
    });
    const cards = document.querySelectorAll('.card');
    const addCardBtn = document.querySelectorAll('.btn');
    for(const crd of cards) {
        crd.addEventListener('dragstart',dragstart);
    }
    for(const btn of addCardBtn) {
        btn.addEventListener('click', e => {
            if(localStorage.getItem(e.target.id) == e.target.id) {
                console.log("already there")
            } else {
                localStorage.setItem(e.target.id,e.target.id);
                addWatchListCard(e.target.id)
            }          
        })
    }
    
}

function addWatchListCard(id) {
    const watchListCard = document.createElement('div');
    const watchListCardContent = document.createElement('div');
    const thumbnailContainer = document.createElement('a');
    const thumbnail = document.createElement('img');
    const watchCardDetailContainer = document.createElement('div');
    const animeTitle = document.createElement('h2');
    const genre = document.createElement('p');
    animeTitle.innerText = animeData[id].title;
    let gens = '';
    animeData[id].genres.map((genre,index) => {
        if(index==0) {
            gens  = gens.concat(`${genre.name}`);
        } else {
            gens  = gens.concat(`, ${genre.name}`);
        } 
    })
    genre.innerText=`Genre: ${gens}`
    watchCardDetailContainer.classList.add('watchCardDetails');
    thumbnailContainer.classList.add('watchListThumbnail');
    thumbnail.src = animeData[id].images.jpg.large_image_url;
    watchListCard.classList.add("watchListCard");
    watchListCardContent.classList.add('cardContent');
    watchCardDetailContainer.appendChild(animeTitle);
    watchCardDetailContainer.appendChild(genre);
    thumbnailContainer.appendChild(thumbnail);
    watchListCardContent.appendChild(thumbnailContainer);
    watchListCardContent.appendChild(watchCardDetailContainer);
    watchListCard.appendChild(watchListCardContent);
    watchListContainer.appendChild(watchListCard);
}

function dragstart() {
    draggingElementId=this.id;
}

function populateUI() {
    const len = animeData.length;
    for(var i=0;i<len;i++) {
        if(localStorage.getItem(i)==i) {
            addWatchListCard(i);
        } 
    }
}

watchListContainer.addEventListener('dragenter', dragEnter);

ratingSelect.addEventListener('change', e => {
    ratingFilterCard(e.target.value);
});

genreSelect.addEventListener('change', e => {
    console.log(e.target.value);
    [...genres].map((item,idx) => {
        console.log(idx, e.target.value);
        if(idx==e.target.value) {
            genreFilterCard(item);
        }
    })
    // ticketPrice = +e.target.value;
    // setMovieData(e.target.selectedIndex, e.target.value);
    // updateSelectedCount();
});

function dragEnter(e) {
    e.preventDefault();
    if(localStorage.getItem(draggingElementId) == draggingElementId) {
        console.log("already there")
    } else {
        localStorage.setItem(draggingElementId,draggingElementId);
        addWatchListCard(draggingElementId)
    }
   
    console.log('Item entered', e.target);
}

async function getAnime() {
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime`)
        const data = await res.json();
        animeData=data.data;
        addCard(animeData);
        filterData(animeData);
        populateUI();
        return data;
    } catch(err) {
        console.log('Error occured while fetching data err: ',err);
    }
}

getAnime();