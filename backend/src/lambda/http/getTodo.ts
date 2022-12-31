import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodoForUserByTodoID as getTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils';
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    //const todos = '...'
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    let todo = null
    try {
      todo = await getTodo(userId, todoId)
    }
    catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: error.message
        })
      }
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "items": todo
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
