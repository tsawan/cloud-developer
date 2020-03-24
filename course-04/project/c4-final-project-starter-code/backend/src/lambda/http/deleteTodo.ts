import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

import { todoDomain } from '../../domain/todoDomain'

import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    console.log(`will delete ${todoId}`)
    await todoDomain.deleteTodo(getUserId(event), todoId)

    logger.info(`deleted todo`, { todoId: todoId })

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
