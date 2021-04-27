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
const process = __importStar(require("process"));
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
// shows how the runner will run a javascript action with env / stdout protocol
test("test runs", () => {
    process.env["INPUT_DOMAIN"] = "example.com";
    process.env["INPUT_PUBLISH_DIR"] = "./images";
    process.env["INPUT_AWS_ACCESS_KEY_ID"] = "mock_id";
    process.env["INPUT_AWS_SECRET_ACCESS_KEY"] = "mock_secret_key";
    process.env["GITHUB_WORKSPACE"] = ".";
    const ip = path.join(__dirname, "..", "lib", "main.js");
    const options = {
        env: process.env,
    };
    // No idea how to get past the DNS point
    expect(() => {
        cp.execSync(`node ${ip}`, options).toString();
    }).toThrow("The security token included in the request is invalid");
});
