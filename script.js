const savedToDos = document.querySelector('[data-saved-todos]');
const formNewToDo = document.querySelector('[data-form-new-todo]');
const inputNewToDo = document.querySelector('[data-input-new-todo]');

const LOCAL_STORAGE_LIST_KEY = 'todo.lists';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

const clearElement = element => {
	while (element.firstChild) element.removeChild(element.firstChild);
};

const save = () => {
	localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
};

const render = () => {
	clearElement(savedToDos);
	lists.forEach(list => {
		const template = document.querySelector('#template__list-item');
		const copied = document.importNode(template.content, true);
		const li = copied.querySelector('li');
		li.setAttribute('data-id', list.id);
		li.setAttribute('data-completed', list.complete);
		copied.querySelector('[data-checkbox-complete]').checked = list.complete;
		copied.querySelector('label').setAttribute('aria-checked', list.complete);
		copied.querySelector('[data-text-todo]').innerText = list.task;
		savedToDos.append(copied);
	});
};

const deleteTask = id => {
	lists = lists.filter(list => list.id !== id);
	clearElement(savedToDos);
	save();
	render();
};

const toggleComplete = (element, id) => {
	const isChecked = element.checked;
	const li = element.closest('li');
	const label = li.querySelector('label');
	const list = lists.find(list => list.id === id);
	list.complete = element.checked;
	label.setAttribute('aria-checked', isChecked);
	li.setAttribute('data-completed', isChecked);
	save();
};

const createList = (task, isCompleted) => {
	return {
		id: Date.now().toString(),
		task: task,
		complete: isCompleted,
	};
};

const handleSubmit = e => {
	e.preventDefault();
	const newToDo = inputNewToDo.value;
	if (newToDo == null || newToDo === '') return;
	newToDo.trim();

	lists.push(createList(newToDo, false));
	save();
	render();
	inputNewToDo.value = '';
};

const completeOrDeleteTask = e => {
	const element = e.target;
	const id = element.closest('li').getAttribute('data-id');
	if (element.hasAttribute('data-delete')) {
		deleteTask(id);
	} else if (element.hasAttribute('data-checkbox-complete')) {
		toggleComplete(element, id);
	} else return;
};

formNewToDo.addEventListener('submit', e => handleSubmit(e));

savedToDos.addEventListener('click', e => completeOrDeleteTask(e));

render();
