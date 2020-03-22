import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'

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
    ...parsedBody
  }

  await docClient.put({
    TableName: todosTable,
    Item: newTodo
  }).promise()

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
