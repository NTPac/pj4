import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import * as uuid from 'uuid'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { todoBuilder } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    console.log(newTodo)
    const userId = getUserId(event)
    const todo = todoBuilder(newTodo,userId)
    
    const creTodo = await createTodo(todo)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "item": creTodo
      })
    }
  }
)



handler.use(
  cors({
    credentials: true
  })
)
