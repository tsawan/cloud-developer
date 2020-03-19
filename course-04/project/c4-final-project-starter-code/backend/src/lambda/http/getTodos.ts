import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../../models/TodoItem'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
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
  return result.Items as TodoItem[];
}