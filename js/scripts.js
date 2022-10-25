// [Seleção de elementos pelo ID]
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editId = document.querySelector("#edit-id");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const searchInput = document.querySelector("#search-input");

/*
* Status:
* P - Pendente
* F - Finalizado
*/

// [LocalStorage - salva os todos]
const localStorageTodos = JSON.parse(localStorage
    .getItem('todos'));

// [Se todos não for nulo, ele salva no LocalStorage, senão, cria uma array vazio]
let todos = localStorage
  .getItem('todos') !== null ? localStorageTodos : [];

// [Atualiza o LocalStorage]
const updateLocalStorage = () => {

    localStorage.setItem('todos', JSON.stringify(todos))
}

// [Verifica o status do todo (pendente ou finalizado)]
const updateTodoLocalStorage = id => {

    todos.forEach((todo) => {

        if (todo.id == id) {
            todo.status = todo.status == "P" ? "F" : "P";
        }        
    });

    // [Atualiza o LocalStorage após atualizar o status]
    updateLocalStorage();    
}

// [Gerar o ID referente ao todo]
const generateID = () => Math.round(Math.random() * 1000);

// [Pegando as referências do todo]
const addTodosArray = (name, status) => {

    todos.push({
        id: generateID(), 
        name: name, 
        status: status
    });

    updateLocalStorage();
}

// [Remover o todo de acordo com o ID]
const removeTodo = id => {

    todos = todos.filter(todo => 
      todo.id != id)

    updateLocalStorage();
    init();
}

// [FUNÇÕES]

// [Adiciona o novo todo e cria como pendente]
const saveTodo = ({ name, status, id }) => {

    if (id === '') {

        addTodosArray(name, "P");
    }
    
    // [Insere um data-id no HTML para cada todo]
    const todo = document.createElement("div");
    todo.setAttribute("data-id", id);
    todo.classList.add("todo");

    // [Cria um todoTitle(nome da tarefa)]
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = name;
    todo.appendChild(todoTitle);

    // [Cria o botão de "finalizado"]
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    // [Cria o botão de "editar"]
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    // [Cria o botão de "remover"]
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    // [Salva o status de "pendente" para "feito".]
    if (status !== "P") {

        todo.classList.add("done");
    }

    // [Cria a lista dos todos]
    todoList.appendChild(todo);

    // [Limpar o campo do input da tarefa]
    todoInput.value = "";
};


// [Faz o botão de editar funcionar]
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
    init(); //atualizar a página após edição
}

const selectStatus = (status) => {

    const filterTodos = todos.filter(todo => todo.status === status)
    filterTodos.forEach(saveTodo);    
}

const searchTodos = value =>  {

    const filterTodos = todos.filter(todo => todo.name.match(value));
    console.log(filterTodos);
    
    todoList.innerHTML = '';

    filterTodos.forEach(saveTodo);
}

const getRandomIntegerInclusive = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomTodo = () =>
    todos[getRandomIntegerInclusive(0, todos.length - 1)]

const todo = getRandomTodo()

todos.textContent = todo;

const init = () => {

    todoList.innerHTML = '';
    todos.forEach(saveTodo);
    todoInput.focus();
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


searchInput.addEventListener("input", (e) => {

    const searchInputValue = e.target.value;

        searchTodos(searchInputValue);
});