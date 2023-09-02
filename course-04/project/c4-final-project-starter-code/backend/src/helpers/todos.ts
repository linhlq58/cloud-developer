import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
// import * as createError from 'http-errors'

const todosAccess = new TodosAccess()

export async function getTodosForUser(): Promise<TodoItem[]> {
    return todosAccess.getTodosForUser()
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
  ): Promise<TodoItem> {
  
    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)
  
    return await todosAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false
    })
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    todoId: string,
    jwtToken: string
  ): Promise<UpdateTodoRequest> {
  
    const userId = parseUserId(jwtToken)
  
    return await todosAccess.updateTodo(
        updateTodoRequest,
        todoId,
        userId
    )
}
