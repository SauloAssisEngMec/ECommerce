import * as cdk from "aws-cdk-lib";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwlogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambdaNodeJS.NodejsFunction;
  productsAdminHandler: lambdaNodeJS.NodejsFunction;
}
export class ECommerceApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props);

    const logsGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs");
    const api = new apigateway.RestApi(this, "ECommerceApi", {
      restApiName: "ECommerceApi",
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logsGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
    });

    // integrating api gateway with lambda fecth products function

    const productsFecthIntegration = new apigateway.LambdaIntegration(
      props.productsFetchHandler
    );

    // root= /, then the result is  /products.

    const productsResource = api.root.addResource("products");
    productsResource.addMethod("GET", productsFecthIntegration);

    //  adding {id} for get by id, then teh result is /products/{id}
    const productIdResource = productsResource.addResource("{id}");
    productIdResource.addMethod("GET", productsFecthIntegration);
  }
}
