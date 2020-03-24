import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log(`will delete ${todoId} by ${getUserId(event)}`);
  const response = await deleteTodo(getUserId(event), todoId);

  logger.info(`deleted todo`, {todoId: todoId})

  return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        response
      })
    }   
}

const deleteTodo = async (userId:string, todoId:string):Promise<string> => {
  await docClient.delete({
    TableName: todosTable,
    Key:{
      "userId":userId,
      "todoId":todoId
    }
}).promise()

  return 'deleted';
}

