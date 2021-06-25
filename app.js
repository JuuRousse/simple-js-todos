const inputTodo = document.querySelector('#input-todo');
const addTodoBtn = document.querySelector('.btn-add');
const listTweets = document.querySelector('#list');
const alertMessage = document.querySelector('#alert-message');
const alertMessageText = document.querySelector('#alert-message-text');
const TWO_SECOUNDS = 2000;



const TODOS = 'todos';
const rawTodos = localStorage.getItem(TODOS);
if (!rawTodos) {
    localStorage.setItem(TODOS, JSON.stringify([]));
}

const getTodos = () => {
    const rawTodos = localStorage.getItem(TODOS);
    let result = JSON.parse(rawTodos);

    return result;
}

const CHECKED = 'checked';
const rawCheckedTodos = localStorage.getItem(CHECKED);

if (!rawCheckedTodos) {
    localStorage.setItem(CHECKED, JSON.stringify([]));
}

const getCheckedTodos = () => {
    const rawCheckedTodos = localStorage.getItem(CHECKED);
    let result = JSON.parse(rawCheckedTodos);
    return result;
}

const renderTodosList = (todos) => {
    const checkedTodos = getCheckedTodos();

    listTweets.innerHTML = todos.map((todo, i) => {
        const checkedTodos = getCheckedTodos();
        const isCheched = checkedTodos.some((checked) => todo === checked);

        return `
            <li class="todo-item">
                <label class="todo-item-inner">
                    <input type="checkbox" id="todo" class="check checkbox" ${isCheched ? "checked" : ""}>
                    <span class="todo-text" data-id="${i + 1}"> ${todo}</span>
                </label>
                <button type="button" class="btn-remove">🗑</button>
            </li>
        `
    }).join('');

    const btnsRemoveTweet = document.querySelectorAll('.btn-remove');
    const checkboxes = document.querySelectorAll('.check');

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', (event) => {
            const value = event.target.parentNode.parentNode.querySelector('.todo-text').innerText;

            const checkedTodos = getCheckedTodos();

            if (checkedTodos.some((item) => item.trim() === value.trim())) {
                const result = checkedTodos.filter((item) => item !== value)
                localStorage.setItem(CHECKED, JSON.stringify(result));
            } else {
                checkedTodos.push(value);
                localStorage.setItem(CHECKED, JSON.stringify(checkedTodos));
            }
            renderTodosList(todos);

        })
    })

    btnsRemoveTweet.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const value = event.target.parentNode.querySelector('.todo-text').innerText;
            const resultTodos = todos.filter((item) => {
                return item.trim() !== value.trim();
            })

            localStorage.setItem(TODOS, JSON.stringify(resultTodos));

            const resultCheckedTodos = checkedTodos.filter((item) => {
                return item.trim() !== value.trim();
            })

            localStorage.setItem(CHECKED, JSON.stringify(resultCheckedTodos));

            renderTodosList(resultTodos);
        })
    })
}

renderTodosList(getTodos());

const addNewTodo = (value) => {
    const todos = getTodos();
    const isTheSame = todos.some((item) => {
        return value === item;
    })

    if (value === '') {
        alertMessage.classList.remove('hidden');
        alertMessageText.innerHTML = 'Error! Tweet can not be empty...';
        setTimeout(() => {
            alertMessage.classList.add('hidden');
        }, TWO_SECOUNDS);
    } else if (isTheSame) {
        alertMessage.classList.remove('hidden');
        alertMessageText.innerHTML = 'Error! You already tweeted it!';
        setTimeout(() => {
            alertMessage.classList.add('hidden');
        }, TWO_SECOUNDS);
    } else {
        const todos = JSON.parse(localStorage.getItem(TODOS));
        todos.push(value);
        const resultTodos = JSON.stringify(todos);
        localStorage.setItem(TODOS, resultTodos);

        renderTodosList(todos);

        inputTodo.value = '';
    }
}

inputTodo.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        const value = event.target.value;
        addNewTodo(value);
    }
})

addTodoBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const value = inputTodo.value;

    addNewTodo(value);
})