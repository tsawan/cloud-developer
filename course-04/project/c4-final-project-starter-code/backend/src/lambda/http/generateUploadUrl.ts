import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getUserId } from '../utils'
import * as uuid from 'uuid'

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const validTodoId = await todoExists(getUserId(event), todoId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true 
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }else{
    const result= await generateURL(todoId,event)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        result
      })
    }  
}
}

const todoExists = async (userId: string, todoId: string) => {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()

  return !!result.Item
}

const generateURL = async (todoId:string,event:any) => {
  const imageId = uuid.v4()
  const newItem = await createImage(todoId, imageId, event)
  const url = getUploadUrl(imageId)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        newItem: newItem,
        uploadUrl: url
      })
    }
      
  }

  const createImage = async (todoId: string, imageId: string, event: any) => {
    const timestamp = new Date().toISOString()
    const newImage = JSON.parse(event.body)
  
    const newItem = {
      todoId,
      timestamp,
      imageId,
      ...newImage,
      imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }
    console.log('Storing new item: ', newItem)
  
    await docClient
      .put({
        TableName: imagesTable,
        Item: newItem
      })
      .promise()
  
    return newItem
  }

  const getUploadUrl = (imageId: string) => {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: parseInt(urlExpiration)
    })
    
  }
  