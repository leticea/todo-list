// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editId = document.querySelector("#edit-id");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const searchInput = document.querySelector("#search-input");
const btn = document.querySelector("#erase-button");

let oldInputValue;
let regexp = new RegExp(/[a-z]/i);

/*
* Status:
* P - Pendente
* F - Finalizado
*/

//LocalStorage
const localStorageTodos = JSON.parse(localStorage
    .getItem('todos'));

let todos = localStorage
  .getItem('todos') !== null ? localStorageTodos : [];

const updateLocalStorage = () => {

    localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoLocalStorage = id => {

    todos.forEach((todo) => {

        if (todo.id == id) {
            todo.status = todo.status == "P" ? "F" : "P";
        }        
    });

    updateLocalStorage();    
}
    
const generateID = () => Math.round(Math.random() * 1000);

const removeTodo = id => {

    todos = todos.filter(todo => 
      todo.id != id)

    updateLocalStorage();
    init();
}

const addTodosArray = (name, status) => {

    todos.push({
        id: generateID(), 
        name: name, 
        status: status
    });

    updateLocalStorage();
}

//Funções
const saveTodo = ({ name, status, id }) => {

    if (id === '') {

        addTodosArray(name, "P");
    }
    
    const todo = document.createElement("div");
    todo.setAttribute("data-id", id);
    todo.classList.add("todo");

    if (status !== "P") {

        todo.classList.add("done");
    }

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = name;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
};

const toggleForms = () => {

    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (id, name) => {
    
    todos.forEach((todo) => {

        if (todo.id === Number(id)) {

            todo.name = name;
        }        
    })

    updateLocalStorage();
    init(); //atualizar a página após edição - ok
}

const selectStatus = (status) => {

    const filterTodos = todos.filter(todo => todo.status === status)
    filterTodos.forEach(saveTodo);    
}

const init = () => {

    todoList.innerHTML = '';
    todos.forEach(saveTodo);
}
  
init();

//Eventos
todoForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {

        saveTodo({ name: inputValue, status: "P", id: '' });
    }
});

document.addEventListener("click", (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {

        const id = parentEl.getAttribute("data-id");
        updateTodoLocalStorage(id)
        parentEl.classList.toggle("done");
    }

    if (targetEl.classList.contains("remove-todo")) {

        const id = parentEl.getAttribute("data-id");
        removeTodo(id);
        parentEl.remove();
    }

    if (targetEl.classList.contains("edit-todo")) {

        const id = parentEl.getAttribute("data-id");
        parentEl.classList.toggle("edit");    

        toggleForms();

        editInput.value = todoTitle;
        editId.value = id;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {

    e.preventDefault();
    toggleForms();
});

btn.addEventListener("click", (e) => {    

    todoList.innerHTML = '';

    e.preventDefault();    

    const value = searchInput.value;

    let todoTitle = regexp.exec(value);

    console.log(todoTitle);
});

filterSelect.addEventListener("change", (e) => {

   todoList.innerHTML = ''; 

   if (filterSelect.value === "done") {

        selectStatus("F");
    }

    if (filterSelect.value === "todo") {

        selectStatus("P");
    } 
  
    if (filterSelect.value === "all") {

        todos.forEach(saveTodo);
    }    
});

editForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {

        updateTodo(editId.value, editInputValue);
    }

    toggleForms();
});