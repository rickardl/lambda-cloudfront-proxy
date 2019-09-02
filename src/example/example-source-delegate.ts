import { CloudFrontRequest } from "aws-lambda";

import { SourceDelegate } from "../triggers/delegates/source-delegate";
import {
  COOKIE_PATH,
  REPLACEMENT_ORIGIN_DOMAIN_NAME,
  SOURCE_COOKIE_NAME,
  SOURCE_MAIN,
  SOURCE_REPLACEMENT
} from "./constants";

export class ExampleSourceDelegate implements SourceDelegate {
  get cookieName(): string {
    return SOURCE_COOKIE_NAME;
  }

  get cookiePath(): string {
    return COOKIE_PATH;
  }

  /*eslint-disable-next-line no-unused-vars */
  public shouldCache(request: CloudFrontRequest): boolean {
    return true;
  }

  /*eslint-disable-next-line no-unused-vars */
  public decideSource(cloudFrontRequest: CloudFrontRequest): string {
    const m = 0.5;
    return Math.random() < m ? SOURCE_REPLACEMENT : SOURCE_MAIN;
  }

  public shouldSubstituteOrigin(
    cloudFrontRequest: CloudFrontRequest,
    source: string
  ): boolean {
    return source === SOURCE_REPLACEMENT;
  }

  public substituteOrigin(
    cloudFrontRequest: CloudFrontRequest,
    source: string
  ) {
    if (
      cloudFrontRequest.origin == null ||
      cloudFrontRequest.origin.custom == null
    ) {
      return;
    }
    if (source === SOURCE_REPLACEMENT) {
      cloudFrontRequest.origin.custom.domainName = REPLACEMENT_ORIGIN_DOMAIN_NAME;
      cloudFrontRequest.headers.host = [
        { key: "host", value: REPLACEMENT_ORIGIN_DOMAIN_NAME }
      ];
    }
  }
}
