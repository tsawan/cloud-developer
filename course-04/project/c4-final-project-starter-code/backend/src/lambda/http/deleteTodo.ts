import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  deleteTodo(todoId, event);
  return undefined
}

const deleteTodo = async (todoId: string, event: APIGatewayProxyEvent) => {
  const response = await docClient.delete({
    TableName: todosTable,
    Key: {
      userId: getUserId(event),
      todoId: todoId
    }
  }).promise()

  return response;
}