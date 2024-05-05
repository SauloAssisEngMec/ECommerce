#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
dotenv.config();
import * as cdk from "aws-cdk-lib";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { ECommerceApiStack } from "../lib/ecommerceAPI-stack";
import { ProductsAppLayersStack } from "../lib/productsAppLayers-stack";

const app = new cdk.App();

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// tag is important to manager cost etc

const tags = {
  cost: "ECommerce",
  team: "Saulo",
};

const productsAppLayersStack = new ProductsAppLayersStack(
  app,
  "ProductsAppLayers",
  {
    tags: tags,
    env: env,
  }
);

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env,
});

productsAppStack.addDependency(productsAppLayersStack); // depende indiretamente, não é uam dependencia forte

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env,
});

eCommerceApiStack.addDependency(productsAppStack);
