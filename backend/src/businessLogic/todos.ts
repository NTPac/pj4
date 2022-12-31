
import { TodosAccess } from '../helpers/todosAcess'
import { TodoAttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const todosAcess = new TodosAccess()
const todoAttachmentUtils = new TodoAttachmentUtils()

export async function createTodo(todoItem: TodoItem): Promise<TodoItem> {
    const todo = await todosAcess.createTodo(todoItem)
    return todo
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    const todoList = todosAcess.getTodosForUser(userId)
    return todoList
}

export async function getTodoForUserByTodoID(userId: string, todoId: string): Promise<TodoItem> {
    const todo = todosAcess.getTodoForUserByTodoID(userId, todoId)
    return todo
} 

export async function deleteTodo(todoItem: string, userId: string) {
    await todosAcess.deleteTodo(todoItem, userId)
}

export async function updateTodo(todoid: string, todoItem: TodoUpdate, userId: string) {
    await todosAcess.updateTodo(todoid, todoItem, userId)
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    const uploadUrl = await todoAttachmentUtils.getSignedUrl(todoId)
    await todosAcess.updateAttachmentUrl(userId, todoId)
    return uploadUrl
}

export async function deleteAttachmentUrl(todoId: string, userId: string): Promise<void> {
    try{
        let url = await todosAcess.getAttachmentUrl(userId, todoId)
        await todoAttachmentUtils.deleteTodoItemAttachment(url)
        await todosAcess.deleteAttachmentUrl(userId, todoId)
    }
    catch (error) {
        throw error
    }
    return
}