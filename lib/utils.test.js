"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
test("getSubdomain", () => {
    expect(utils_1.getSubdomain("example.com")).toBe(null);
    expect(utils_1.getSubdomain("sub.example.com")).toBe("sub");
});
test("getDomain", () => {
    expect(utils_1.getDomain("sub.example.com")).toBe("example.com");
    expect(utils_1.getDomain("example.com")).toBe("example.com");
});
