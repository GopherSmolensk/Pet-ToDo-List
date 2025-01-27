

export function getTasksLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks')
    return tasksJSON ? JSON.parse(tasksJSON) : []
}

export function setTasksLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

export function generateUniqueId() {
    const timesNow = Date.now()
    const randomNumberOne = Math.floor(Math.random() * 1000)
    const randomNumberTwo = Math.floor(Math.random() * 1000)
    return timesNow + randomNumberOne + randomNumberTwo;
}