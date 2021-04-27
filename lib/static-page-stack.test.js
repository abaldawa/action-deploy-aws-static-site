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
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = __importStar(require("@aws-cdk/core"));
const static_page_stack_1 = require("./static-page-stack");
test("AWS s3 static site template handling 404 routing error", () => {
    const app = new cdk.App();
    const stack = new static_page_stack_1.StaticPageStack(app, "MyTestStack", {
        folder: "./images",
        stackName: "MyTestStack",
    });
    assert_1.expect(stack).to(assert_1.haveResource("AWS::S3::Bucket", {
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
    }));
});
