// todo business domain
import { todoDao } from '../dao/todoDao'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoDomain = <any>{}

todoDomain.getTodos = async (userId: string) => {
  return await todoDao.getTodos(userId)
}

todoDomain.deleteTodo = async (userId: string, todoId: string) => {
  await todoDao.deleteTodo(userId, todoId)
}

todoDomain.updateTodo = async (
  userId: string,
  todoId: string,
  todoRequest: UpdateTodoRequest
) => {
  await todoDao.updateTodo(userId, todoId, todoRequest)
}

todoDomain.createTodo = async (
  userId: string,
  todoRequest: CreateTodoRequest
): Promise<TodoItem> => {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const dueDate = new Date().toISOString()

  const newTodo: TodoItem = {
    userId,
    todoId,
    createdAt,
    dueDate,
    done: false,
    name: todoRequest.name
  }

  await todoDao.createTodo(newTodo)
  return newTodo
}

export { todoDomain }
