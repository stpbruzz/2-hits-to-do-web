class Task {
    constructor(description) {
        this.description = description
        this.flag = false
    }
}

class TaskField {
    constructor(description) {
        this.task = new Task(description)
        
        this.text = document.createElement("input")
        this.text.id = "text"
        this.text.value = this.task.description
        this.text.disabled = true

        this.checkbox = document.createElement("INPUT")
        this.checkbox.setAttribute("type", "checkbox")
        this.checkbox.id = "checkbox"
        this.checkbox.addEventListener("click", () => {
            if (this.task.flag == false) {
                this.task.flag = true
                update()
            } else {
                this.task.flag = false
                update()
            }
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
                this.task.description = this.text.value
                this.editButton.innerHTML = "edit"
            }
        })

        this.deleteButton = document.createElement("button")
        this.deleteButton.innerHTML = "delete"
        this.deleteButton.id = "delete"
        this.deleteButton.addEventListener("click", () => {
            tasksFields.forEach(taskField => {
                if (this.task == taskField.task) {
                    tasksFields.splice(tasksFields.indexOf(taskField), 1)
                }
            })
            update()
        })
    }
}

let description = document.getElementById("addDescription")
let list = document.getElementById("taskList")
let tasksFields = []

document.getElementById("addButton").onclick = function() {
    tasksFields.push(new TaskField(description.value))
    update()
    description.value = ""
}

function update() {
    list.innerHTML = ""

    tasksFields.forEach(taskField => {
        if (taskField.task.flag == false) {
            let li = document.createElement("li")
            li.appendChild(taskField.checkbox)
            li.appendChild(taskField.text)
            li.appendChild(taskField.editButton)
            li.appendChild(taskField.deleteButton)
            list.append(li)
        }
    });

    tasksFields.forEach(taskField => {
        if (taskField.task.flag == true) {
            let li = document.createElement("li")
            li.appendChild(taskField.checkbox)
            li.appendChild(taskField.text)
            li.appendChild(taskField.editButton)
            li.appendChild(taskField.deleteButton)
            list.append(li)
        }
    });
}

document.getElementById("saveButton").onclick = function() {
    let tasksJSON = []
    tasksFields.forEach(taskField => {
        tasksJSON.push(taskField.task)
    })

    let json = JSON.stringify(tasksJSON)
    let blob = new Blob([json], {type: "text/plain"})
    let jsonObjectUrl = URL.createObjectURL(blob)
    let filename = "to-do_save.json"
    let anchor = document.createElement("a")
    anchor.href = jsonObjectUrl
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(jsonObjectUrl)
}

document.getElementById("loadButton").onclick = function() {
    
}