
const todosAcess = require('../helpers/todosAcess')
import { TodoItem } from '../models/TodoItem'

export async function createTodo(todoItem: TodoItem): Promise<TodoItem> {
    const todo = await todosAcess.createTodo(todoItem)
    return todo
}

export async function getTodosForUser(userId: string): Promise<TodoItem> {
    const todoList = todosAcess.getTodosForUser(userId)
    return todoList
}