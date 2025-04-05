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
import { Key } from "aws-cdk-lib/aws-kms";
import { Effect } from "aws-cdk-lib/aws-iam";

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myKmsKey = new Key(this, "KMSKey", {
      enableKeyRotation: true,
      alias: "portfolio-key",
      description: "KMS key for encrypting S3 bucket",
    });

    const accessLogsBucket = new Bucket(this, "AccessLogsBucket", {
      // bucketName: "portfolio-access-logs-bucket-aahousseini",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const websiteBucket = new Bucket(this, "MyStaticSiteBucket", {
      // bucketName: "portfolio-static-site-bucket-aahousseini",
      versioned: true,
      // encryption: BucketEncryption.KMS,
      // encryptionKey: myKmsKey,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      enforceSSL: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "logs/",

      // websiteIndexDocument: "index.html",
      // websiteErrorDocument: "error.html",
    });

    const oai = new OriginAccessIdentity(this, "MyOAI", {
      comment: "Access identity for CloudFront to access S3 bucket",
    });
    websiteBucket.grantRead(oai);
    myKmsKey.grantDecrypt(oai);

    const origin = new S3Origin(websiteBucket, {
      originAccessIdentity: oai,
    });

    const accessLogsBucketForCloudFront = new Bucket(
      this,
      "AccessLogsBucketForCloudFront",
      {
        // bucketName: "portfolio-access-logs-bucket-cloudfront-aahousseini",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      }
    );

    // accessLogsBucketForCloudFront.addToResourcePolicy(
    //   new iam.PolicyStatement({
    //     Effect: Effect.ALLOW,
    //     principals: [new iam.ServicePrincipal("logging.s3.amazonaws.com")],
    //     actions: ["s3:PutObject", "s3:PutObjectAcl"],
    //     resources: [`${cloudFrontLogsBucket.bucketArn}/*`],
    //     conditions: {
    //       StringEquals: {
    //         "aws:SourceAccount": cdk.Stack.of(this).account,
    //         "aws:SourceArn": `arn:aws:cloudfront::${cdk.Stack.of(this).account}:distribution/${distribution.distributionId}`,
    //       },
    //     },
    //   })
    // );

    const distribution = new Distribution(this, "MyDistribution", {
      defaultBehavior: {
        origin: origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      // logBucket:
    });
    new BucketDeployment(this, "DeployWebsite", {
      destinationBucket: websiteBucket,
      sources: [Source.asset("../portfolio/out")],
      distribution,
      distributionPaths: ["/*"], // Invalidate CloudFront cache
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
