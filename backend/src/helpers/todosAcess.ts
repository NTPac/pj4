import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
const docClient: DocumentClient = createDynamoDBClient()
const logger = createLogger('TodosAccess')
logger.info(XAWS)

// TODO: Implement the dataLayer logic
export async function createTodo(todoItem: TodoItem): Promise<TodoItem> {
  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  }).promise()

  return todoItem
}

export async function getTodosForUser(userId: string) {
  const params = {
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': {
        S: userId
      }
    }
  }
  docClient.query(params, function (error, data) {
    if (error) {
      logger.error(error)
      throw new Error(error.message)
    }
    else {
      return data.Items
    }
  })
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}