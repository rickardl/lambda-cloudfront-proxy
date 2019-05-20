import {
  CloudFrontRequest,
  CloudFrontRequestCallback,
  CloudFrontRequestEvent,
  Context
} from "aws-lambda";

import { hasCookie, setCookie } from "../utils/cloudfront-cookie";
import { SourceDelegate } from "./delegates/source-delegate";

test("dummy", () => {
  expect(true).toBe(true);
});
