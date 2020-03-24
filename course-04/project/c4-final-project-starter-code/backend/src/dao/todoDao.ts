// default data layer for todo dynamodb table.

import * as AWS  from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { TodoItem } from '../models/TodoItem'

import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('todoDao')

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const todoDao = <any>{}

todoDao.getTodos = async (userId: string) => {
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: '#userId = :i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    })
    .promise()
  return result.Items as TodoItem[]
}

todoDao.updateTodo = async (
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
) => {
  await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#D': 'done'
      },
      ExpressionAttributeValues: {
        ':y': updatedTodo.done
      },
      UpdateExpression: 'SET #D = :y',
      ReturnValues: 'ALL_NEW'
    })
    .promise()
}

todoDao.createTodo = async (newTodo: TodoItem) => {
  await docClient
    .put({
      TableName: todosTable,
      Item: newTodo
    })
    .promise()

  logger.info(`Todo created`)
}

todoDao.deleteTodo = async (userId: string, todoId: string) => {
  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()
  logger.info(`Todo deleted`)
}

export { todoDao }
