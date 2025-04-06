import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Bucket,
  BucketEncryption,
  BlockPublicAccess,
} from "aws-cdk-lib/aws-s3";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginAccessIdentity,
  OriginRequestPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Key } from "aws-cdk-lib/aws-kms";
import * as iam from "aws-cdk-lib/aws-iam";

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myKmsKey = new Key(this, "KMSKey", {
      enableKeyRotation: true,
      alias: "portfolio-key",
      description: "KMS key for encrypting S3 bucket",
    });

    const accessLogsBucket = new Bucket(this, "AccessLogsBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const websiteBucket = new Bucket(this, "MyStaticSiteBucket", {
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      enforceSSL: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "logs/",
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
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      }
    );

    const apiHostname = cdk.Fn.select(
      2,
      cdk.Fn.split("/", cdk.Fn.importValue("ApiEndpoint"))
    );

    const distribution = new Distribution(this, "MyDistribution", {
      defaultBehavior: {
        origin: origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      logBucket: accessLogsBucketForCloudFront,
      logFilePrefix: "cloudfront-logs/",
    });

    distribution.addBehavior("/api/*", new HttpOrigin(apiHostname), {
      allowedMethods: AllowedMethods.ALLOW_ALL,
      cachePolicy: CachePolicy.CACHING_DISABLED,
      originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
    });

    new BucketDeployment(this, "DeployWebsite", {
      destinationBucket: websiteBucket,
      sources: [Source.asset("../portfolio/out")],
      distribution,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
