import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const lambdaRequestID = context.awsRequestId;
  const eventRequestID = event.requestContext.requestId;
  const method = event.httpMethod;

  console.log(`ÀPI Gateway Request ID ${eventRequestID} 
               Lambda Request ID ${lambdaRequestID}`);

  if (event.resource === "/products") {
    if (method === "GET") {
      console.log("GET request");

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "GET products working",
        }),
      };
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request!!!!",
    }),
  };
}
