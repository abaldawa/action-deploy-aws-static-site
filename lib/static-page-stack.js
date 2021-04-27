"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticPageStack = void 0;
const cdk = __importStar(require("@aws-cdk/core"));
const s3 = __importStar(require("@aws-cdk/aws-s3"));
const s3deploy = __importStar(require("@aws-cdk/aws-s3-deployment"));
const cloudfront = __importStar(require("@aws-cdk/aws-cloudfront"));
const env = {
    // Stack must be in us-east-1, because the ACM certificate for a
    // global CloudFront distribution must be requested in us-east-1.
    region: "us-east-1",
    account: (_a = process.env.CDK_DEFAULT_ACCOUNT) !== null && _a !== void 0 ? _a : "mock",
};
class StaticPageStack extends cdk.Stack {
    constructor(scope, id, { stackName, folder, }) {
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
                    replaceKey: s3.ReplaceKey.with("/index.html"),
                },
            ],
        });
        // Cloudfront
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "Distribution", {
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
        });
        // Deployment
        new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
            sources: [s3deploy.Source.asset(folder)],
            destinationBucket: websiteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}
exports.StaticPageStack = StaticPageStack;
