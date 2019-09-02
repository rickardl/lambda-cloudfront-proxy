import {
  Callback,
  CloudFrontRequest,
  CloudFrontRequestEvent,
  CloudFrontRequestResult,
  Context
} from "aws-lambda";

import { getCookieValue } from "../utils/cloudfront-cookie";
import { SourceDelegate } from "./delegates/source-delegate";

export class OriginRequestTrigger {
  constructor(private sourceDelegate: SourceDelegate) {}

  public handler = async (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback<CloudFrontRequestResult>
  ) => {
    const request = event.Records[0].cf.request;
    const source = this.resolveRequestSource(request);
    if (this.sourceDelegate.shouldSubstituteOrigin(request, source)) {
      this.sourceDelegate.substituteOrigin(request, source);
    }
    callback(null, request);
  };

  private resolveRequestSource(request: CloudFrontRequest): string {
    const { cookieName, decideSource } = this.sourceDelegate;
    let source: string | undefined;
    if (cookieName) {
      source = getCookieValue(request.headers, cookieName);
    }
    if (!source) {
      source = decideSource(request);
    }
    return source;
  }
}
