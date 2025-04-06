#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSiteStack } from "../lib/static-site-stack";
import { ApplicationStack } from "../lib/application-stack";

const app = new cdk.App();
new ApplicationStack(app, "ApplicationStack", {});
new StaticSiteStack(app, "StaticSiteStack", {});
