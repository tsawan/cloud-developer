import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

import { todoDomain } from '../../domain/todoDomain'

import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoRequest: CreateTodoRequest = JSON.parse(event.body)

    logger.info('Received create request')
    const userId = getUserId(event)

    const newTodo: TodoItem = await todoDomain.createTodo(userId, todoRequest)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: newTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
