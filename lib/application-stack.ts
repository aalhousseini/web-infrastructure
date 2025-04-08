import { CfnOutput, Fn, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  Deployment,
  LambdaIntegration,
  LambdaRestApi,
  RestApi,
  Stage,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, TableClass, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import path = require("path");

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const visitorFn = new Function(this, "Visitor-counter", {
      runtime: Runtime.PYTHON_3_11,
      handler: "visitor-count.handler",
      code: Code.fromAsset(path.join(__dirname, "../lambda/visitor-counter")),
    });

    const visitortable = new TableV2(this, "VisitorTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      contributorInsights: true,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      //remove this line to use the default table class
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    visitorFn.addEnvironment("VISITOR_TABLE", visitortable.tableName);
    const api = new RestApi(this, "PortfolioAPI", {
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
      },
      deployOptions: {
        stageName: "prod",
      },
    });

    visitortable.grantReadWriteData(visitorFn);

    const apiResource = api.root.addResource("api");
    const contactResource = apiResource.addResource("contact");
    contactResource.addMethod("POST");

    const visitorCount = apiResource.addResource("visitor-count");
    visitorCount.addMethod("GET", new LambdaIntegration(visitorFn));
    visitorCount.addMethod("POST", new LambdaIntegration(visitorFn));

    const projectsTable = new TableV2(this, "Projects-Table", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      contributorInsights: true,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    const projectsFn = new Function(this, "Projects-Lambda", {
      runtime: Runtime.PYTHON_3_11,
      handler: "projects-adder.handler",
      code: Code.fromAsset(path.join(__dirname, "../lambda/projects")),
    });

    projectsTable.grantReadWriteData(projectsFn);

    projectsFn.addEnvironment("PROJECTS_TABLE", projectsTable.tableName);

    const projects = apiResource.addResource("projects");
    projects.addMethod("GET", new LambdaIntegration(projectsFn));
    projects.addMethod("POST", new LambdaIntegration(projectsFn));

    new CfnOutput(this, "ApiEndpoint", {
      value: Fn.select(2, Fn.split("/", api.url)),
      exportName: "ApiEndpoint",
    });
  }
}
