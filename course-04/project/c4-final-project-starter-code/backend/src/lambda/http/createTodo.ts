import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getUserId } from '../utils'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('rcvd event ', event);
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)
  console.log('received create req');
  const newTodo = {
    userId: getUserId(event),
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
      newTodo
    })
  }
}
