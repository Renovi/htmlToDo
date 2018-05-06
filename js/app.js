document.querySelector('#taskInput').addEventListener('keyup', function (e) {
	let key = e.which || e.keyCode // for cross browser support
	if ((key == 13) && (document.querySelector('#taskInput').value.length > 0)) // 13 is value of enter key
		addToList(this.value.trim());
});

let taskList = [], completedTasks = [];

if (JSON.parse(localStorage.getItem('taskList'))) {
	taskList = JSON.parse(localStorage.getItem('taskList'));
} else {
	localStorage.setItem('taskList', JSON.stringify(taskList));
}

updateCompletedListArray();
updateListView();

function updateCompletedListArray() {
	taskList.forEach(function (task) {
		if (task.done) {
			completedTask.push(taskList.indexOf(task) + '');
		}
	});
}

function addToList(task) {
	taskList.push({
		name: task,
		done: false
	});
	updateListView();

	localStorage.setItem('taskList', JSON.stringify(taskList));
	document.querySelector('#taskInput').value = '';
}

function updateListView() {
	let ul = document.getElementById('taskList');

	ul.innerHTML = '';

	taskList.forEach(function (task) {
		let listItem = document.createElement('li'),
			taskLabel = document.createElement('label'),
			deleteBtn = document.createElement('button'),
			checkbox = document.createElement('input');


		listItem.className = 'list-group-item item-list d-flex justify-content-between';
		listItem.id = taskList.indexOf(task);

		taskLabel.className = 'taskLabel';
		taskLabel.textContent = task.name;
		taskLabel.htmlFor = 'c' + taskList.indexOf(task);

		deleteBtn.className = 'btn btn-danger delBtn';
		deleteBtn.textContent = 'x';
		deleteBtn.onclick = deleteThisTask;

		checkbox.className = 'taskCheckbox';
		checkbox.id = 'c' + taskList.indexOf(task);
		checkbox.type = 'checkbox';
		checkbox.checked = task.done;
		checkbox.onclick = toggleChecked;

		listItem.appendChild(checkbox);
		listItem.appendChild(taskLabel);
		listItem.appendChild(deleteBtn);
		ul.appendChild(listItem);
	});
}

function toggleChecked(e) {
	let checkedStatus = e.target.checked,
		task = e.target.parentElement,
		taskId = task.id,
		removed = false;

	taskList[taskId].done = checkStatus;
	if (completedTask.length === 0) {
		completedTask.push(taskId);
	} else {
		completedTasks.forEach(function (index) {
			if (taskId === index) {
				completedTasks.splice(completedTasks.indexOf(index), 1);
				removed = true;
			}
		});

		if (!removed) {
			completedTasks.push(taskId);
			completedTasks.sort();
		}
	}
	saveLocalList();
}


function deleteThisTask(e) {
	taskList.splice(e.target.parentElement.id, 1);
	saveLocalList();
	updateCompletedListArray();
	updateListView();
}

function deleteCompleted() {
	let length = completedTasks.length;
	for (let i = length; i >= 0; i--) {
		taskList.splice(completedTasks[i], 1);
	}

	saveLocalList();
	updateCompletedListArray();
	updateListView();
}

function deleteAll() {
	if ((taskList.length > 0) && confirm('are you sure?')) {
		let ul = document.getElementById('taskList');
		ul.innerHTML = '';
		taskList = completedTasks = [];
		saveLocalList();
	}
}

function saveLocalList() {
	localStorage.setItem("taskList", JSON.stringify(taskList));
}