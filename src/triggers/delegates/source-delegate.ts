import { CloudFrontRequest } from "aws-lambda";

export interface SourceDelegate {
  readonly cookieName?: string; // required if response should cache
  readonly cookiePath?: string; // default is "/"

  shouldCache(request: CloudFrontRequest): boolean;

  decideSource(cloudFrontRequest: CloudFrontRequest): string;
  shouldSubstituteOrigin(
    cloudFrontRequest: CloudFrontRequest,
    source: string
  ): boolean;
  substituteOrigin(cloudFrontRequest: CloudFrontRequest, source: string): void;
}
