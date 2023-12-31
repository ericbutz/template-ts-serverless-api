import { DynamoDB } from "aws-sdk"
import { Item } from "./base"
import { getClient } from "./client"

export class User extends Item {

  username: string
  name: string
  company: string

  constructor(username: string, name?: string, company?: string) {
      super();
      this.username = username;
      this.name = name || "";
      this.company = company || "";
  }

  static fromItem(item?: DynamoDB.AttributeMap): User {
      if (!item) throw new Error("No item!");
      return new User(item.username.S, item.name.S, item.company.S);
  }

  get pk(): string {
      return `USER#${this.username}`;
  }

  get sk(): string {
      return `USER#${this.username}`;
  }

  toItem(): Record<string, unknown> {
      return {
          ...this.keys(),
          username: { S: this.username },
          name: { S: this.name },
          company: { S: this.company }
      }
  }
}

export const createUser = async (user: User): Promise<User> => {
    const client = getClient();

    try {
        await client
            .putItem({
                TableName: process.env.TABLE_NAME,
                Item: user.toItem(),
                ConditionExpression: "attribute_not_exists(PK)"  // For any write you can include an expression. If it evalutes to false the write does not happen. So, this makes sure the user does not already exist.
            })
            .promise()
        return user
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * Returns a User record
 *
 * @param username - The username
 * @returns User object
 */
export const getUser = async (username: string): Promise<User> => {
    const client = getClient()
    const user = new User(username)

    try {
        const resp = await client
            .getItem({
                TableName: process.env.TABLE_NAME,
                Key: user.keys()
            })
            .promise()
        return User.fromItem(resp.Item)
    } catch (error) {
        console.log(error)
        throw error
    }
}
