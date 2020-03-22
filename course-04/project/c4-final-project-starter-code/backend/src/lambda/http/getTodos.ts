import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../../models/TodoItem'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todos = await getTodos(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todos
    })
  }  
}

const getTodos = async (userId: string) => {
  const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: '#userId = :i',
      ExpressionAttributeNames: {
          '#userId': 'userId'
      },
      ExpressionAttributeValues: {
          ':i': userId
      },
  }).promise()
  return result.Items as TodoItem[];
}