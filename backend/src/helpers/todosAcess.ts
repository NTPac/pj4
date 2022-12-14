import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')
logger.info(XAWS)

// TODO: Implement the dataLayer logic

export class TodosAccess {

  constructor(
    private readonly s3bucket = process.env.S3_BUCKET_NAME,
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly docClient: DocumentClient = createDynamoDBClient()) {
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    let result = null;
    result = await this.docClient.query(params).promise()

    const items = result.Items as TodoItem[]
    return items
  }

  async getTodoForUserByTodoID(userId: string, todoId: string): Promise<TodoItem> {
    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    }
    let result = null;
    result = await this.docClient.query(params).promise()

    const items = result.Items as TodoItem[]
    return items[0]
  }

  async deleteTodo(todoId: string, userId: string) {
    const params = {
      TableName: this.todosTable,
      Key: {
        "todoId": todoId,
        "userId": userId
      }
    }
    return this.docClient.delete(params, function (error, data) {
      if (error) {
        logger.error(error)
        throw new Error(error.message)
      }
      else {
        return data
      }
    })
  }


  async updateTodo(todoId: string, todo: TodoUpdate, userId: string) {
    var params = {
      TableName: this.todosTable,
      Key: {
        "todoId": todoId,
        "userId": userId
      },
      UpdateExpression: 'set #n = :name, #d = :dueDate, #s = :done',
      ExpressionAttributeNames: {
        '#n': 'name',
        '#d': 'dueDate',
        '#s': 'done'
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done,
      }
    }
    this.docClient.update(params, function (error, data) {
      if (error) {
        logger.error(error)
        throw error
      }
      else {
        return data
      }
    })
  }

  async updateAttachmentUrl(userId: string, todoId: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set attachmentUrl=:attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": `https://${this.s3bucket}.s3.amazonaws.com/${todoId}`
      }
    }).promise()
  }
  async getAttachmentUrl(userId: string, todoId: string): Promise<string> {
    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    }
    let result = null;
    result = await this.docClient.query(params).promise()
    let todos = result.Items as TodoItem[]
    let todo = todos[0]
    console.log(todos)
    let url = todo.attachmentUrl
    console.log(url)
    return url
  }

  async deleteAttachmentUrl(userId: string, todoId: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set attachmentUrl=:attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": ""
      }
    }).promise()
  }
}

function createDynamoDBClient() {
  // if (process.env.IS_OFFLINE) {
  //   console.log('Creating a local DynamoDB instance')
  //   return new XAWS.DynamoDB.DocumentClient({
  //     region: 'localhost',
  //     endpoint: 'http://localhost:8000'
  //   })
  // }

  return new XAWS.DynamoDB.DocumentClient()
}