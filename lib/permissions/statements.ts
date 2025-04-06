import * as iam from "aws-cdk-lib/aws-iam";
import { Actions } from "./actions";

const Lambda = {
  Lambda: {
    AllowInvoke: () =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.Invoke,
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      }),
    AllowInvokeRestricted: (lambdaFunctionArns: string[]) =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.Invoke,
        effect: iam.Effect.ALLOW,
        resources: lambdaFunctionArns,
      }),
    AllowInvokeWithPrincipal: (account: string) =>
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["lambda:InvokeFunction"],
        effect: iam.Effect.ALLOW,
        principals: [new iam.AccountPrincipal(account)],
      }),
    AllowGetFunction: () =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.Get,
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      }),
    AllowCreateFunction: () =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.Create,
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      }),
    AllowTagResource: () =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.TagResource,
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      }),
    AllowDeleteFunction: () =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.Delete,
        effect: iam.Effect.ALLOW,
        resources: ["*"],
      }),
    AllowManageFunction: (accountNumber: string) =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.Manage,
        effect: iam.Effect.ALLOW,
        resources: [`arn:aws:lambda:eu-west-1:${accountNumber}:function:*`],
      }),

    AllowManageEventSource: (accountNumber: string) =>
      new iam.PolicyStatement({
        actions: Actions.Lambda.ManageEventSource,
        effect: iam.Effect.ALLOW,
        resources: [`*`],
      }),

    CreateNetworkInterfacesInVpc: () =>
      new iam.PolicyStatement({
        actions: [
          ...Actions.EC2.CRUDNetworkInterfaces,
          ...Actions.EC2.DescribeSecurityGroupsVpcsAndSubnets,
        ],
        effect: iam.Effect.ALLOW,
        resources: ["arn:aws:ec2:eu-west-1::*"],
      }),
  },
};

const IAM = {
  IAM: {
    GetRole: () =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.IAM.GetRole,
        resources: ["*"],
      }),
    PassRole: () =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.IAM.PassRole,
        resources: ["*"],
      }),
    CRUDRole: (account: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.IAM.CRUDRole,
        resources: [`arn:aws:iam::${account}:role/*`],
      }),
  },
};

const DYNAMODB = {
  DYNAMODB: {
    ScanTable: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.Scan,
        resources: [`arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}`],
      }),
    QueryTable: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.Query,
        resources: [`arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}`],
      }),
    QueryTableIndex: (account: string, tableName: string, indexName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.Query,
        resources: [
          `arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}/index/${indexName}`,
        ],
      }),
    UpdateItem: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.UpdateItem,
        resources: [`arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}`],
      }),
    GetItem: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.GetItem,
        resources: [
          `arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}/stream/*`,
        ],
      }),
    GetItemNoStream: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.GetItem,
        resources: [`arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}`],
      }),
    PutItem: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.PutItem,
        resources: [
          `arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}/stream/*`,
        ],
      }),
    PutItemNoStream: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.PutItem,
        resources: [`arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}`],
      }),
    EnableStream: (account: string, tableName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.DYNAMODB.EnableStream,
        resources: [
          `arn:aws:dynamodb:eu-west-1:${account}:table/${tableName}/stream/*`,
        ],
      }),
  },
};

const SNS = {
  SNS: {
    Publish: (account: string, topicName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.SNS.Publish,
        resources: [`arn:aws:sns:eu-west-1:${account}:${topicName}`],
      }),
    PublishCloudWatch: (topicArn: string, account: string) =>
      new iam.PolicyStatement({
        sid: "AllowCloudWatchPublish",
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("cloudwatch.amazonaws.com")],
        actions: Actions.SNS.Publish,
        resources: [topicArn],
        conditions: {
          StringEquals: {
            "AWS:SourceOwner": account,
          },
        },
      }),
    Create: (account: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.SNS.Create,
        resources: [`arn:aws:sns:eu-west-1:${account}:*`],
      }),
    PublishThroughSSLOnly: (topicArn: string) => {
      return new iam.PolicyStatement({
        sid: "AllowPublishThroughSSLOnly",
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: Actions.SNS.Publish,
        resources: [topicArn],
        conditions: {
          Bool: {
            "aws:SecureTransport": "false",
          },
        },
      });
    },
  },
};

const S3 = {
  S3: {
    Get: (bucketName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.S3.Get,
        resources: [
          `arn:aws:s3:::${bucketName}/*`,
          `arn:aws:s3:::${bucketName}`,
        ],
      }),
    Put: (bucketName: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.S3.Put,
        resources: [`arn:aws:s3:::${bucketName}/*`],
      }),
  },
};

const SES = {
  SES: {
    SendEmail: (lambdaRoleArn: string) =>
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Actions.SES.SendEmail,
        resources: [lambdaRoleArn],
      }),
  },
};

export const Statements = {
  ...Lambda,
  ...IAM,
  ...DYNAMODB,
  ...SNS,
  ...S3,
  ...SES,
};
