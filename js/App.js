"use strict"

import {
    getTasksLocalStorage,
    setTasksLocalStorage, 
    generateUniqueId,
    updateListTask,
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
}
