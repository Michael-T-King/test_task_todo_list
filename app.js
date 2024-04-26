let arr = [];

const form = document.querySelector('form');
const input = document.querySelector('input');
const task = document.querySelector('.task');
const menu = document.querySelectorAll('.menu__items');
const counterAllText = document.querySelector('.counter__done-notdone');
const counterDoneText = document.querySelector('.counter__done-done');
const progress = document.querySelector('.progress');
const progresNum = document.querySelector('.progress-bar span');
const wellDone = document.querySelector('.well__done');
const addFirstTodo = document.querySelector('.add__first-text');
const textContainer = document.querySelector('.text__conteiner');
const btnClose = document.querySelector('.btn__close');
const body = document.querySelector('body');

let menuState = 'All';
let counterAll = 0;
let counterDone = 0;
let progressStatus = 0;

function saveTodoList() {
    localStorage.setItem('body', JSON.stringify(arr));
}

function loadTodoList() {
    let savedList = localStorage.getItem('body');
    if (savedList) {
        arr = JSON.parse(savedList);
    }
}

let showTask = () => {
    counterAllText.textContent = '0';
    counterDoneText.textContent = '0';
    progresNum.textContent = '0';
    progress.style.width = '0';
task.innerHTML = '';

if(arr.length === 0) {
    addFirstTodo.style.display = 'block';
}
else addFirstTodo.style.display = 'none';

arr.forEach((el, idx) => {
    
    let isCompleted = el.completed ? 'completed' : '';
    let isFavorite = el.favorite ? 'favorite' : '';
    counterAll = arr.length;
    counterAllText.textContent = counterAll;

arr.reduce((acc, el) =>{
        el.completed ? counterDone = acc + el.completed : counterDone = acc - el.completed;
        return counterDone;
    },0);
    counterDoneText.textContent = counterDone;

    progressStatus = Math.floor((counterDone / counterAll) * 100);
    progresNum.textContent = `${progressStatus}%`;
    progress.style.width = `${progressStatus}%`;

    if(progressStatus === 100) {
        for (let i = 0; i <= 100; i++) {
            setTimeout(() => {
            textContainer.style.display = 'flex';
            btnClose.style.display = 'flex';
            wellDone.style.opacity = i/100;
        }, i*10);
    }
}
    else if(progressStatus < 100){
    wellDone.style.opacity = '0';
    btnClose.style.display = 'none';
    textContainer.style.display = 'none';
    }

    btnClose.addEventListener('click',() =>{
    btnClose.style.display = 'none';
    textContainer.style.display = 'none';
    });

    let date = new Date(el.date).toLocaleString();

    if (menuState === 'All' ||
        (menuState === 'Not done' && !el.completed) ||
        (menuState === 'Done' && el.completed) ||
        (menuState === 'Favorites' && el.favorite)) {

        task.innerHTML += `
            <li class="li__items ${isCompleted}">
                <div class="text__container">
                    <span class="is__favorite material-symbols-outlined" data-index="${idx}">favorite</span>
                    <p class="text">${idx+1}. ${el.text}</p>
                    <p class="date">(${date})</p>
                </div>
                <div class="btn__container" data-index="${idx}">
                    <button class="complete button" data-index="${idx}">&#x2713;</button>
                    <button class="delete button" data-index="${idx}">
                        <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                    <button class="favorite button" data-index="${idx}">
                        <span class="material-symbols-outlined ${isFavorite}">favorite</span>
                </button>
            </div>
        </li>
    `;
    }
});

    const deleteBtn = document.querySelectorAll('.delete');
    deleteBtn.forEach(button => {
    button.addEventListener('click', deleteTask);
    });

    const completeBtn = document.querySelectorAll('.complete');
    completeBtn.forEach(button => {
    button.addEventListener('click', completeTask);
    });

    const favoriteBtn = document.querySelectorAll('.favorite');
    favoriteBtn.forEach(button => {
    button.addEventListener('click', toggleFavorite);
    });

    const isFavorites = document.querySelectorAll('.is__favorite');
    isFavorites.forEach(favorite => {
    let idx = favorite.dataset.index;
    favorite.style.opacity = arr[idx].favorite ? '1' : '0';
    });
};

let deleteTask = (event) => {
    let index = event.currentTarget.dataset.index;
    arr.splice(index, 1);
    saveTodoList();
    showTask();
};

let completeTask = (e) => {
    let idx = e.target.dataset.index;
    arr[idx].completed = !arr[idx].completed;
    saveTodoList();
    showTask();
};

let toggleFavorite = (e) => {
    let idx = e.currentTarget.dataset.index;
    arr[idx].favorite = !arr[idx].favorite;
    saveTodoList();
    showTask();
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputValue = input.value.trim();
    if (inputValue !== '') {
        arr.unshift({
            text: inputValue,
            date: Date.now(),
            completed: false,
            favorite: false,
        });
        saveTodoList();
        showTask();
        input.value = '';
    }
});

menu.forEach(item => {
    item.addEventListener('click', () => {
        menuState = item.textContent.trim();
        showTask();
    });
});

menu.forEach(item => {
    if (menuState === 'All') {
    menu[0].style.backgroundColor = '#56bbed';
    menu[0].style.color = '#fff';
    }
  item.addEventListener('click', () => {
    menu.forEach(menuItem => {
        menuItem.style.backgroundColor = 'transparent';
        menuItem.style.color = '#56bbed';
    });
    item.style.backgroundColor = '#56bbed';
    item.style.color = '#fff';
  });
});

loadTodoList();
showTask();
