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

  console.log(`ÀPI Gateway Request ID ${eventRequestID} 
                 Lambda Request ID ${lambdaRequestID}`);

  if (event.resource === "/products") {
    console.log("POST products in admin");

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "POST Admin products working",
      }),
    };
  } else if (event.resource === "/products/{id}") {
    const productId = event.pathParameters!.id as string;

    if (event.httpMethod === "PUT") {
      console.log(`PUT in resource /products/${productId}`);
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: `PUT in resource /products/${productId}`,
        }),
      };
    } else if (event.httpMethod === "DELETE") {
      console.log(`DELETE in resource /products/${productId}`);
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: `DELETE in resource /products/${productId}`,
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
