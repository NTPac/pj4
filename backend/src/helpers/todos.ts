// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
export function todoBuilder(todoReq: CreateTodoRequest,userId: string): TodoItem{
    const todoId = uuid.v4()
    const todo = {
      todoId: todoId,
      userId: userId,
      createdAt: new Date().toISOString(),
      name: todoReq.name,
      dueDate: todoReq.dueDate,
      done: false,
      attachmentUrl: '',
      ...todoReq
    }
    return todo
}
