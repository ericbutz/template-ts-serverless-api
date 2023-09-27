# Serverless API Template

A serverless API template bootstrapped from various 

## References
* Uses example code from [alexdebrie](https://github.com/alexdebrie)
* User [TSDoc](https://tsdoc.org/) standard for comments
* Uses [ts-jest](https://kulshekhar.github.io/ts-jest/) for unit testing

## Usage

To deploy this project, run the following commands in your terminal:

```bash
git clone git@github.com:ericbutz/template-ts-serverless-api.git && cd template-ts-serverless-api
npm install
sls deploy
```

You should see output indicating the service was deployed and your endpoints are live:

```bash
✔ Service deployed to stack template-ts-serverless-api-dev (87s)

endpoints:
  POST - https://********.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://********.execute-api.us-east-1.amazonaws.com/dev/users/{username}
functions:
  createUser: template-ts-serverless-api-dev-createUser (2.7 kB)
  getUser: template-ts-serverless-api-dev-getUser (2.7 kB)
```
## Testing

#### Command Line

The following command line operations let you test the API:

```
aws dynamodb get-item \
  --profile <profilename if not default> \
  --region us-east-1 \
  --table-name <tablename> \
  --key '{ "PK": {"S": "USER#user1"}, "SK": {"S": "USER#user1"}}'
```

#### System Testing

The [template-api-test](https://github.com/ericbutz/template-api-test) repo contains a system test that can be run against this template API.

## Terms

- A [**User**](./src/data/user.ts) represents a person that has signed up for our application. They will be uniquely identified by a username.

- A [**Product**](./src/data/product.ts) represents a product owned by a particular User. You can browse all Products for a particular User in reverse-chronological order. 

## AWS Deploy

The [serverless.yml](./serverless.yml) file deploys the API to the specified account and profile on AWS. 

## DynamoDB

Below are some patterns that are useful for using DynamoDB:

- [Abstract base class for entities](./src/data/base.ts). It defines common methods that need to be implemented for each entity -- `PK` & `SK` values; `toItem()` method; etc.

- [`getClient()` function to return a DynamoDB client](./src/data/client.ts). This returns a singleton DynamoDB client to enable re-use of the underlying HTTP connection across Lambda invocations. Also, it includes common client parameters like timeouts to ensure proper configuration.

- [Using ULIDs as unique, sortable identifiers](./src/data/photo.ts). A [ULID](https://github.com/ulid/spec) provides the uniqueness of a UUID but is prefixed with the creation-time timestamp. This allows for lexicographic sorting of the IDs based on creation time.

- [ConditionExpressions when creating a User](./src/data/user.ts#51). This ensures uniquness of usernames for all Users.

- [Query operation to fetch all Products owned by a User](./src/data/comment.ts#87). The Query operation allows us to fetch an array of items when we only know the partition key (the PhotoId). 

- [Using multiple requests in many-to-many relationships](./src/data/follow.ts#106). When retrieving the products for a particular User, we make two requests. First, we make a Query operation to find all the Products owned by a particular User. Second, we make a BatchGetItem operation to hydrate all the Product items.


