import {
  CloudFrontRequest,
  CloudFrontRequestCallback,
  CloudFrontRequestEvent,
  Context
} from 'aws-lambda';

import { hasCookie, setCookie } from '../utils/cloudfront-cookie';
import { SourceDelegate } from './delegates/source-delegate';

/*
 * This trigger is not required for non-cached responses
 */
export class ViewerRequestTrigger {
  constructor(private sourceDelegate: SourceDelegate) {}

  public handler = async (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: CloudFrontRequestCallback
  ) => {
    const request = event.Records[0].cf.request;

    if (this.sourceDelegate.shouldCache(request)) {
      this.setSourceCookieIfNotSet(request);
    }
    callback(null, request);
  };

  private setSourceCookieIfNotSet(request: CloudFrontRequest) {
    const headers = request.headers;
    const { cookieName, decideSource } = this.sourceDelegate;

    if (!cookieName) {
      throw Error('cookieName in source delegate is not set');
    }

    if (!hasCookie(headers, cookieName)) {
      const source = decideSource(request);
      if (source) {
        setCookie(headers, cookieName, source);
      }
    }
  }
}
