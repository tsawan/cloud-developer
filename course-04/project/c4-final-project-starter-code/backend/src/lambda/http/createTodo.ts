import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

import { todoDomain } from '../../domain/todoDomain'

import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoRequest: CreateTodoRequest = JSON.parse(event.body)

  logger.info('Received create request')
  const userId = getUserId(event)

  const newTodo: TodoItem = await todoDomain.createTodo(userId, todoRequest)

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodo
    })
  }
}
