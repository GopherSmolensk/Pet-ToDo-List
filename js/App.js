"use strict"

import {
    getTasksLocalStorage,
    setTasksLocalStorage, 
    generateUniqueId,
    updateListTask,
    initSortableList,
     } from './utils.js'

const form = document.querySelector('.form')
const textareaForm = document.querySelector('.form__textarea')
const buttonSendForm = document.querySelector('.form__send-btn') 
const buttonCancel = document.querySelector('.form__cancel-btn')
const output = document.querySelector('.output')
let editId = null
let isEditTask = false

// отображаем задачи при первой загрузке страницы
updateListTask()

// все слушатели событий
form.addEventListener('submit', sendTask)
buttonCancel.addEventListener('click', resetSendForm)
output.addEventListener('dragover', initSortableList)
output.addEventListener("dragenter", event => event.preventDefault())


output.addEventListener('click', event => {
    const taskElement = event.target.closest('.task__btns')
    if (!taskElement) return

    if(event.target.closest('.task__pinned')) {
        pinnedTask(event)
    } else if (event.target.closest('.task__edit')) {
        editTask(event)
    } else if (event.target.closest('.task__del')) {
        delTask(event)
    } else if (event.target.closest('.task__done')) {
        doneTask(event)
    }
})

// все функции
function sendTask(event) {
    event.preventDefault()
    // у введённого значения обрезаются пробелы больше чем один
    // вначале и в конце, а также через регулярное выражение
    // если их больше чем один пробел в самом тексте
    const task = textareaForm.value.trim().replace(/\s+/g, '')
        // если ни чего не введено, то появляется предупреждение и выход из функции return
        if(!task) {
            return alert('Поле не должно быть пустым!')
        }

        if (isEditTask) {
            saveEditedTask(task)
            return
        }

        const arrayTasksLocalStorage = getTasksLocalStorage();
        arrayTasksLocalStorage.push({
            id: generateUniqueId(),
            task: task,
            done: false,
            pinned: false,
            position: 1000,
        })
        setTasksLocalStorage(arrayTasksLocalStorage)
        updateListTask()

        form.reset()
}

function doneTask(event) {
    const task = event.target.closest('.task')
    const id = Number(task.dataset.taskId)

    const arrayTasksLocalStorage = getTasksLocalStorage()
    const index = arrayTasksLocalStorage.findIndex(task => task.id === id)

    if (index === -1) {
        return alert ('Такая задача не найдена!!!')
    }

    if (!arrayTasksLocalStorage[index].done && arrayTasksLocalStorage[index].pinned) {
        arrayTasksLocalStorage[index].pinned = false
    }

    if (arrayTasksLocalStorage[index].done) {
        arrayTasksLocalStorage[index].done = false
    } else {
        arrayTasksLocalStorage[index].done = true
    }

    setTasksLocalStorage(arrayTasksLocalStorage)
    updateListTask()
}

function pinnedTask(event) {
    const task = event.target.closest('.task')
    const id = Number(task.dataset.taskId)

    const arrayTasksLocalStorage = getTasksLocalStorage()
    const index = arrayTasksLocalStorage.findIndex(task => task.id === id)

    if (index === -1) {
        return alert('Такая задача не найдена!')
    }

    if (!arrayTasksLocalStorage[index].pinned && arrayTasksLocalStorage[index].done) {
        return alert('Чтобы закрепить задачу, сначала уберите отметку о выполнении!')
    }

    if (arrayTasksLocalStorage[index].pinned) {
        arrayTasksLocalStorage[index].pinned = false
    } else {
        arrayTasksLocalStorage[index].pinned = true
    }

    setTasksLocalStorage(arrayTasksLocalStorage)
    updateListTask()
}

function delTask(event) {
    const task = event.target.closest('.task')
    const id = Number(task.dataset.taskId)

    const arrayTasksLocalStorage = getTasksLocalStorage()
    const newTasksArray = arrayTasksLocalStorage.filter(task => task.id !== id)
    setTasksLocalStorage(newTasksArray)
    updateListTask()
}

function editTask(event) {
    const task = event.target.closest('.task')
    const text = task.querySelector('.task__text')
    editId = Number(task.dataset.taskId)


    textareaForm.value = text.textContent
    isEditTask = true
    buttonSendForm.textContent = 'Сохранить'
    buttonCancel.classList.remove('none')
    form.scrollIntoView({behavior: 'smooth'})
}

function saveEditedTask(task) {
    const arrayTasksLocalStorage = getTasksLocalStorage()
    const editedTaskIndex = arrayTasksLocalStorage.findIndex(task => task.id === editId)

    if (editedTaskIndex !== -1) {
        arrayTasksLocalStorage[editedTaskIndex].task = task
        setTasksLocalStorage(arrayTasksLocalStorage)
        updateListTask()
    } else {
        alert('Такая задача не найдена!!!')
    }
    resetSendForm()
}

function resetSendForm() {
    editId = null
    isEditTask = false
    buttonCancel.classList.add('none')
    buttonSendForm.textContent = 'Добавить'
    form.reset()
}