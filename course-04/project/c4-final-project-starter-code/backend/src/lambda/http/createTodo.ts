import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getUserId } from '../utils'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = uuid.v4()
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)
  const newTodo = {
    userId: getUserId(event),
    todoId,
    ...parsedBody,
    done: false
  }

  await docClient.put({
    TableName: todosTable,
    Item: newTodo
  }).promise()

  logger.info(`Todo created for user`, {user: getUserId(event)})

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
