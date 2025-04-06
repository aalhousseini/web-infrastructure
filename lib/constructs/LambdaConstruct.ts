import {
  Duration,
  RemovalPolicy,
  aws_lambda as lambda,
  aws_ec2 as ec2,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { Statements } from "../permissions/statements";
import { FunctionProps } from "aws-cdk-lib/aws-lambda/lib/function";

export interface OptionalLambdaProps {
  environment?: any;
  concurrencyLimit?: number;
  ciConsumerRole?: iam.IRole;
  statements?: iam.PolicyStatement[];
  vpc?: ec2.IVpc;
  subnetType?: ec2.SubnetType;
  secGroup?: ec2.ISecurityGroup;
}

export interface LambdaProps extends OptionalLambdaProps {
  functionName: string;
  handler: string;
  description: string;
}

//const assetsLocation = path.join(__dirname, '../../.assets/');

export class LambdaConstruct extends lambda.Function {
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id, LambdaConstruct.createFunction(props));
    this.addPolicies(props);
  }

  private static createFunction(props: LambdaProps): FunctionProps {
    return {
      functionName: props.functionName,
      runtime: lambda.Runtime.PYTHON_3_11,
      memorySize: 128,
      code: lambda.Code.fromAsset(`{props.handler}.zip`),
      handler: "bootstrap",
      description: props.description,
      timeout: Duration.seconds(60),
      retryAttempts: 2,
      vpc: props.vpc,
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
      vpcSubnets: props.vpc ? { subnetType: props.subnetType } : undefined,
      reservedConcurrentExecutions: props.concurrencyLimit,
      environment: props.environment,
      securityGroups:
        props.secGroup && props.vpc ? [props.secGroup] : undefined,
      role: props.ciConsumerRole,
    };
  }

  private addPolicies(props: LambdaProps) {
    // https://stackoverflow.com/questions/58640829/cloudformation-is-waiting-for-networkinterfaces-associated-with-the-lambda-funct
    if (props.vpc) {
      this.addToRolePolicy(Statements.Lambda.CreateNetworkInterfacesInVpc());
    }
    if (props.statements != undefined) {
      for (const statement of props.statements) {
        this.addToRolePolicy(statement);
      }
    }
  }
}
