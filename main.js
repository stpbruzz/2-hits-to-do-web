class Task {
    constructor(id, description, flag = false) {
        this.id = id
        this.description = description
        this.flag = flag
    }
}

class TaskField {
    constructor(id, description, flag = false) {
        this.task = new Task(id, description, flag)
        
        this.text = document.createElement("input")
        this.text.id = "text"
        this.text.value = this.task.description
        this.text.disabled = true

        this.checkbox = document.createElement("input")
        this.checkbox.setAttribute("type", "checkbox")
        this.checkbox.id = "checkbox"
        this.checkbox.checked = this.task.flag
        this.checkbox.addEventListener("click", () => {
            const uri = 'http://localhost:5112/api/ToDo/' + this.task.id + '/flag'
            
            fetch(uri, {
                method: "PATCH"
            })
            .then (() => getItems())
        })

        this.editButton = document.createElement("button")
        this.editButton.innerHTML = "edit"
        this.editButton.id = "edit"
        this.editButton.addEventListener("click", () => {
            if (this.text.disabled) {
                this.text.disabled = false
                this.editButton.innerHTML = "save"
            } else {
                this.text.disabled = true
                this.editButton.innerHTML = "edit"

                const uri = 'http://localhost:5112/api/ToDo/' + this.task.id + '/description'
                
                const taskDescription = {
                    description: this.text.value
                }

                fetch(uri, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskDescription)
                })
                .then (() => getItems())
            } 
        })

        this.deleteButton = document.createElement("button")
        this.deleteButton.innerHTML = "delete"
        this.deleteButton.id = "delete"
        this.deleteButton.addEventListener("click", () => {
            const uri = 'http://localhost:5112/api/ToDo/' + this.task.id

            fetch(uri, {
                method: "DELETE"
            })
            .then(() => getItems())
        })
    }
}

let description = document.getElementById("addDescription")
let list = document.getElementById("taskList")
let tasksFields = []
const uri = 'http://localhost:5112/api/ToDo/'

function getItems() {
    fetch(uri)
    .then(response => response.json())
    .then(data => {     
        tasksFields = data.map(item => {
            return new TaskField(item.id, item.description, item.flag)
        })
        tasksFields.sort((a, b) => {
            return a.task.id - b.task.id;
        });
        update();
    })
}


document.getElementById("addButton").onclick = function() {
    var taskDescription = {
        description: description.value
    }

    fetch(uri, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskDescription)
    })
    .then(response => response.json())
    .then(() => {
        getItems()
        description.value = ""
    })
}

function update() {
    list.innerHTML = ""

    tasksFields.forEach(taskField => {
        let li = document.createElement("li")
        li.appendChild(taskField.checkbox)
        li.appendChild(taskField.text)
        li.appendChild(taskField.editButton)
        li.appendChild(taskField.deleteButton)
        list.append(li)
    })
}