import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../../models/TodoItem'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async () : Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = 'tahir' // hardcode for now, later get from jwt
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

// parseUserId(jwtToken)
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
//  return result;
  return result.Items as TodoItem[];
}