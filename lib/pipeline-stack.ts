import { CfnCapabilities, Stack, StackProps } from "aws-cdk-lib";
import {
  BuildSpec,
  LinuxBuildImage,
  ComputeType,
  Project,
} from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CloudFormationCreateUpdateStackAction,
  CodeBuildAction,
  CodeStarConnectionsSourceAction,
  ManualApprovalAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new Artifact("source");
    const synthArtifact = new Artifact("synth");
    const buildArtifact = new Artifact("build");

    const connectionArn = ssm.StringParameter.valueForStringParameter(
      this,
      "/connection/github/arn"
    );

    const sourceAction = new CodeStarConnectionsSourceAction({
      actionName: "GitHubSource",
      connectionArn: connectionArn,
      repo: "web-infrastructure",
      owner: "aalhousseini",
      branch: "main",
      output: sourceArtifact,
    });

    const build = new Project(this, "MyProject", {
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: ["npm install -g aws-cdk", "npm ci"],
          },
          build: {
            commands: ["npx cdk synth --output dist"],
          },
        },
        artifacts: {
          "base-directory": "dist",
          files: "**/*",
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_6_0,
        computeType: ComputeType.SMALL,
      },
    });

    const pipeline = new Pipeline(this, "Infrastructure-Pipeline", {
      pipelineName: "BUILD-DEPLOY",
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Build",
          actions: [
            new CodeBuildAction({
              actionName: "Build",
              project: build,
              input: sourceArtifact,
              outputs: [synthArtifact, buildArtifact],
            }),
          ],
        },
        {
          stageName: "Pipeline",
          actions: [
            new CloudFormationCreateUpdateStackAction({
              actionName: "SelfMutate",
              stackName: "PipelineStack",
              templatePath: synthArtifact.atPath("PipelineStack.template.json"),
              adminPermissions: true,
              cfnCapabilities: [CfnCapabilities.ANONYMOUS_IAM],
            }),
            new CloudFormationCreateUpdateStackAction({
              actionName: "ApplicationStack",
              stackName: `ApplicationStack`,
              templatePath: synthArtifact.atPath(
                `ApplicationStack.template.json`
              ),
              adminPermissions: true,
              cfnCapabilities: [CfnCapabilities.NAMED_IAM],
              runOrder: 1,
            }),
            new CloudFormationCreateUpdateStackAction({
              actionName: "StaticSiteStack",
              stackName: `StaticSiteStack`,
              templatePath: synthArtifact.atPath(
                `StaticSiteStack.template.json`
              ),
              adminPermissions: true,
              cfnCapabilities: [CfnCapabilities.NAMED_IAM],
              runOrder: 2,
            }),
          ],
        },
        {
          stageName: "Approve",
          actions: [
            new ManualApprovalAction({
              actionName: "ApproveBeforeDeploy",
            }),
          ],
        },
      ],
    });
  }
}
