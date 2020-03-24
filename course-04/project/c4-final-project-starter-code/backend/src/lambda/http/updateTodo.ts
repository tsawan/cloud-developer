import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')

import { todoDomain } from '../../domain/todoDomain'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    await todoDomain.updateTodo(getUserId(event), todoId, updatedTodo)

    logger.info(`Todo updated`)

    return {
      statusCode: 200,
      body: ''
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
