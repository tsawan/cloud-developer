import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { TodoItem } from '../../models/TodoItem'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const updated = updateTodo(todoId, updatedTodo, event);
  
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


  const updateTodo = async (todoId: string, updatedTodo: UpdateTodoRequest,
    event: APIGatewayProxyEvent) => {
      console.log(updatedTodo, event);
    const response = await docClient.update({
      TableName: todosTable,
      Key: {
        //userId: getUserId(event),
        todoId: todoId
      }
    }).promise()
  
    return response;
  }