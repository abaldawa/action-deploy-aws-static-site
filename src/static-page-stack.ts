import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

const env = {
  // Stack must be in us-east-1, because the ACM certificate for a
  // global CloudFront distribution must be requested in us-east-1.
  region: "us-east-1",
  account: process.env.CDK_DEFAULT_ACCOUNT ?? "mock",
};

export class StaticPageStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    {
      stackName,
      folder,
    }: // fullDomain,
    {
      stackName: string;
      folder: string;
    }
  ) {
    super(scope, id, { stackName, env });

    // S3
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      websiteRoutingRules: [
        {
          condition: {
            httpErrorCodeReturnedEquals: "404",
          },
          replaceKey: s3.ReplaceKey.prefixWith("#!/"),
        },
      ],
    });

    // Cloudfront
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "Distribution",
      {
        originConfigs: [
          {
            customOriginSource: {
              domainName: websiteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        comment: `CDN for static page`,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        errorConfigurations: [
          {
            errorCode: 404,
            responsePagePath: "/index.html",
            responseCode: 200,
          },
          {
            errorCode: 301,
            responsePagePath: "/index.html",
            responseCode: 200,
          },
        ],
      }
    );

    // Deployment
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset(folder)],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
