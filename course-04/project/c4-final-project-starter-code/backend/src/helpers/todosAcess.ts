import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getTodosForUser(): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        const result = await this.docClient.scan({
            TableName: this.todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()
      
        return todoItem
    }

    async updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<UpdateTodoRequest> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n': updateTodoRequest.name,
                ':d': updateTodoRequest.dueDate,
                ':done': updateTodoRequest.done
            },
            ExpressionAttributeNames: {
                "#namefield": "name"
            }
        }).promise()
      
        return updateTodoRequest
    }
}