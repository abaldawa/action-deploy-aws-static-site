import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { StaticPageStack } from "./static-page-stack";

test("AWS s3 static site template handling 404 routing error", () => {
  const app = new cdk.App();
  const stack = new StaticPageStack(app, "MyTestStack", {
    folder: "./images",
    stackName: "MyTestStack",
  });
  expectCDK(stack).to(
    haveResource("AWS::S3::Bucket", {
      WebsiteConfiguration: {
        IndexDocument: "index.html",
        ErrorDocument: "error.html",
        RoutingRules: [
          {
            RoutingRuleCondition: {
              HttpErrorCodeReturnedEquals: "404",
            },
            RedirectRule: {
              ReplaceKeyPrefixWith: "#!/",
            },
          },
        ],
      },
    })
  );

  expectCDK(stack).to(
    haveResourceLike("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        CustomErrorResponses: [
          {
            ErrorCode: 404,
            ResponseCode: 200,
            ResponsePagePath: "/index.html",
          },
          {
            ErrorCode: 301,
            ResponseCode: 200,
            ResponsePagePath: "/index.html",
          },
        ],
      },
    })
  );
});
