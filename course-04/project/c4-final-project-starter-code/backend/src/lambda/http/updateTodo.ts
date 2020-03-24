import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const updated = await updateTodo(getUserId(event), todoId, updatedTodo);
  
  logger.info(`Todo updated`, {todoId, done: updatedTodo.done})
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updated
    })
  }   }


  const updateTodo = async (userId: string, todoId: string, updatedTodo: UpdateTodoRequest):Promise<string> => {
      await docClient.update({
        TableName:todosTable,
        Key:{
          "userId":userId,
          "todoId":todoId
        },
        ExpressionAttributeNames: {
          "#D": "done"
         },   
      ExpressionAttributeValues:{
        ":y": updatedTodo.done
      },
      UpdateExpression: "SET #D = :y",
      ReturnValues:"ALL_NEW"
    }).promise()
    return todoId
  }