import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda"
import { User, createUser } from "../data/user"

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { username, name, company } = JSON.parse(event.body)
    const user = new User(username, name, company)
    await createUser(user)
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            user
        })
    }

    return response
}
