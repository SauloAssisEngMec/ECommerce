import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";

import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ssm from "aws-cdk-lib/aws-ssm";

import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
  // atribute of class
  readonly productsFetchHandler: lambdaNodeJS.NodejsFunction;
  readonly productsAdminHandler: lambdaNodeJS.NodejsFunction;
  readonly productsDDB: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.productsDDB = new dynamodb.Table(this, "ProductsDDB", {
      tableName: "products",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    // Layers of products

    const productsLayerArn = ssm.StringParameter.valueForStringParameter(
      this,
      "ProductsLayerVersionArn"
    );
    const productsLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "productsLayerVersionArn",
      productsLayerArn
    );

    this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(
      this,
      "ProductsFecthFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 512,
        functionName: "ProductsFecthFunction",
        entry: "lambda/products/productsFetchFunction.ts",
        handler: "handler",
        timeout: cdk.Duration.seconds(2),
        bundling: { minify: true, sourceMap: false },
        environment: {
          PRODUCTS_DDB: this.productsDDB.tableName,
        },
        layers: [productsLayer],
      }
    );

    this.productsDDB.grantReadData(this.productsFetchHandler);

    this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(
      this,
      "ProductsAdminFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 512,
        functionName: "ProductsAdminFunction",
        entry: "lambda/products/productsAdminFunction.ts",
        handler: "handler",
        timeout: cdk.Duration.seconds(2),
        bundling: { minify: true, sourceMap: false },
        environment: {
          PRODUCTS_DDB: this.productsDDB.tableName,
        },
        layers: [productsLayer],
      }
    );

    this.productsDDB.grantWriteData(this.productsAdminHandler);
  }
}
