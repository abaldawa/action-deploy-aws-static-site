import * as cdk from "@aws-cdk/core";
import { StaticPageStack } from "./static-page-stack";

const app = new cdk.App();
const { FOLDER } = process.env;
if (FOLDER === undefined) {
  throw new Error("publish_dir has not been defined");
}

new StaticPageStack(app, `StaticPage`, {
  stackName: `StaticPage-react-spa`,
  folder: FOLDER,
});
