import {
  CloudFrontHeaders,
  CloudFrontResponse,
  CloudFrontResponseCallback,
  CloudFrontResponseEvent,
  Context
} from 'aws-lambda';

import { getCookieValue, setCookieOnResponse } from '../utils/cloudfront-cookie';
import { SourceDelegate } from './delegates/source-delegate';

/*
 * This trigger is not required for non-cached responses
 */
export class OriginResponseTrigger {
  constructor(private sourceDelegate: SourceDelegate) {}

  public handler = async (
    event: CloudFrontResponseEvent,
    context: Context,
    callback: CloudFrontResponseCallback
  ) => {
    const { request, response } = event.Records[0].cf;

    if (this.sourceDelegate.shouldCache(request)) {
      const source = this.extractRequestSource(request.headers);
      if (source) {
        this.setSourceCookieOnResponse(response, source);
      }
    }
    callback(null, response);
  };

  private extractRequestSource(headers: CloudFrontHeaders): string {
    const cookieName = this.sourceDelegate.cookieName;
    if (!cookieName) {
      throw Error('cookieName in source delegate is not set');
    }

    const source = getCookieValue(headers, cookieName);
    if (!source) {
      throw Error(`${cookieName} is not set in request header`);
    }

    return source;
  }

  private setSourceCookieOnResponse(response: CloudFrontResponse, source: string) {
    const { cookieName, cookiePath } = this.sourceDelegate;
    if (!cookieName) {
      throw Error('cookieName in source delegate is not set');
    }
    setCookieOnResponse(response, cookieName, source, cookiePath || '/');
  }
}
