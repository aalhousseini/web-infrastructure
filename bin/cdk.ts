#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSiteStack } from "../lib/static-site-stack";
import { ApplicationStack } from "../lib/application-stack";
import { Pipeline } from "aws-cdk-lib/aws-codepipeline";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new ApplicationStack(app, "ApplicationStack", {
  env: {
    account: "559050218007",
    region: "eu-west-1",
    //process.env.CDK_DEFAULT_ACCOUNT,

    // process.env.CDK_DEFAULT_REGION,
  },
});
new StaticSiteStack(app, "StaticSiteStack", {
  env: {
    account: "559050218007",
    region: "eu-west-1",
  },
});

new PipelineStack(app, "PipelineStack", {
  env: {
    account: "559050218007",
    region: "eu-west-1",
  },
});
