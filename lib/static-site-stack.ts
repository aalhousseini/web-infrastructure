import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Bucket,
  BucketEncryption,
  BlockPublicAccess,
} from "aws-cdk-lib/aws-s3";
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

import { S3BucketOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accessLogsBucket = new Bucket(this, "AccessLogsBucket");

    const websiteBucket = new Bucket(this, "MyStaticSiteBucket", {
      encryption: BucketEncryption.KMS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      enforceSSL: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "logs/",
    });

    const oai = new OriginAccessIdentity(this, "MyOAI", {
      comment: "Access identity for CloudFront to access S3 bucket",
    });

    const origin = new S3Origin(websiteBucket, {
      originAccessIdentity: oai,
    });

    const distribution = new Distribution(this, "MyDistribution", {
      defaultBehavior: {
        origin: origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    new BucketDeployment(this, "DeployWebsite", {
      destinationBucket: websiteBucket,
      sources: [Source.asset("../portfolio/out")],

      distribution,
      distributionPaths: ["/*"], // Invalidate CloudFront cache
    });

    // websiteBucket.grantRead(distribution);

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
