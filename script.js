const sidebar = document.getElementById('sidebar');
const form = document.getElementById('form');
const title = document.getElementById('title');
const titleSearch = document.getElementById('titleSearch');
const subTitle = document.getElementById('subTitle');
const closeBtn = document.getElementById('closeBtn');
const colorPallete = document.getElementById('clrPanel');
const clrPaletteFilter = document.getElementById('clrPaletteFilter');
const addCardBtn = document.getElementById('addCardBtn');
const formColorButtons = document.querySelectorAll('.colorBtn');
const filterColorButtons = document.querySelectorAll('.filterClrBtn');
const cardContainer = document.getElementById('cardContainer');
const barStatus = document.getElementById("barStatus");
const cardCount = document.getElementById('cardCount');
const searchError = document.getElementById('searchError');
const formError = document.getElementById('formError');
const addCardError = document.getElementById('addCardError');

var data={};
var selectedCards = [];

// Fetch posts from API
async function getColors() {
    const res = await fetch(
        `https://random-flat-colors.vercel.app/api/random?count=5`
    );
    data = await res.json();
    const len = data.colors.length
    if(len>0 && len<6) {
        [...formColorButtons].map((btn,index) => {
            btn.style.backgroundColor=data.colors[index];
        });
        [...filterColorButtons].map((btn,index) => {
            btn.style.backgroundColor=data.colors[index];
        })
    }
    return data;
}

// removing card
function removeCards() {
    while(cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.lastChild);
    }
}

// adding card
function addCard(colorNumber,titleText,subTitleText) {
    const card = document.createElement('div');
    const cardTitle = document.createElement('h2');
    const cardSubTitle = document.createElement('h4');
    cardTitle.innerText = titleText;
    cardSubTitle.innerText = subTitleText;
    cardTitle.classList.add("cardTitle");
    cardSubTitle.classList.add("cardSubTitle");
    card.classList.add("card");
    card.style.backgroundColor = colorNumber;
    card.appendChild(cardTitle);
    card.appendChild(cardSubTitle);
    cardContainer.appendChild(card);
}

// update Progress bar
function updateProgressBar() {
    const totalCards = selectedCards.length;
    const width = 6*totalCards;
    barStatus.style.width = width + 'rem'; 
    cardCount.innerText = `${totalCards}/5 Creatives`;
}


function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

//searching card via text    
function searchInput(){
    var filteredCard = [];
    if(titleSearch.value.trim()==='') {
        searchError.style.visibility= "hidden";
        return;
    }
    var searchFlag = false;
    selectedCards.map(card => {
        if(card.titleText.trim() === titleSearch.value.trim() || card.subTitleText.trim() === titleSearch.value.trim()) {
            filteredCard.push(card);
            searchFlag = true;
        }
    });

    //if searched failed removing searched cards and retreiving old card
    if(!searchFlag) {
        searchError.style.color = "red";
        searchError.style.visibility= "visible";
        removeCards();
        selectedCards.map(card => {
            const {colorNumber,titleText,subTitleText} = card;
            addCard(colorNumber,titleText,subTitleText);
        });
        return;
    }

    if(filteredCard.length > 0) {
        removeCards();
        searchError.style.visibility= "hidden";
    }
    filteredCard.map(card => {
        const {colorNumber,titleText,subTitleText} = card;
        addCard(colorNumber,titleText,subTitleText);
    });
}
  
const searchCard = debounce(() => searchInput());

addCardBtn.addEventListener('click', e => {
    if(selectedCards.length === 5) {
        addCardBtn.classList.add('disabled');
        addCardError.style.color = "red";
        addCardError.style.visibility= "visible";
        return;
    }
    sidebar.classList.toggle('collapsed');
    addCardBtn.classList.toggle('disabled');
});

closeBtn.addEventListener('click', e => {
    sidebar.classList.toggle('collapsed');
})

colorPallete.addEventListener('click', e => {
    const selectedClr = document.querySelectorAll('.colorSelected');
    [...selectedClr].map((btn,index) => {
        if(btn != e.target) {
            btn.classList.remove('colorSelected');
        }
    })
    e.target.classList.toggle('colorSelected');
})

clrPaletteFilter.addEventListener('click', e => {
    let selectedClr = document.querySelectorAll('.colorSelected');
    const {colors} = data;
    [...selectedClr].map((btn,index) => {
        if(btn != e.target) {
            btn.classList.remove('colorSelected');
        }
    })
    e.target.classList.toggle('colorSelected');
    selectedClr = document.querySelectorAll('.colorSelected');
    if( selectedClr.length === 0) {
        removeCards();
        selectedCards.map(card => {
            const {colorNumber,titleText,subTitleText} = card;
            addCard(colorNumber,titleText,subTitleText);
        });
        return;
    }
    const colorIndex = [...filterColorButtons].indexOf(selectedClr[0]);
    const colorNumber = colors[colorIndex];
    var filteredCard = [];
    selectedCards.map(card => {
        if(card.colorNumber === colorNumber) {
            filteredCard.push(card);
        }
    });
    removeCards();
    filteredCard.map(card => {
        const {colorNumber,titleText,subTitleText} = card;
        addCard(colorNumber,titleText,subTitleText);
    })
})

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const {colors} = data;
    const selectedClr = document.querySelectorAll('.colorSelected');
    const titleText = title.value;
    const subTitleText = subTitle.value;
    const colorIndex = [...formColorButtons].indexOf(selectedClr[0]);
    const colorNumber = colors[colorIndex] || '';
    if(colorNumber === '' || subTitleText === '' || titleText === '') {
        formError.style.color = "red";
        formError.style.visibility= "visible";
        return;
    }
    formError.style.visibility= "hidden";
    selectedCards.push({
        colorNumber,
        titleText,
        subTitleText
    });
    addCard(colorNumber,titleText,subTitleText);
    updateProgressBar();
    addCardBtn.classList.toggle('disabled');
    title.value='';
    subTitle.value=''
    selectedClr[0].classList.toggle('colorSelected');
    sidebar.classList.toggle('collapsed');
});

getColors();