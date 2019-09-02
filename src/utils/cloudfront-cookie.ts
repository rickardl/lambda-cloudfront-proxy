import { CloudFrontHeaders, CloudFrontResponse } from 'aws-lambda';

interface Cookies {
  [key: string]: string;
}

export function getCookieValue(headers: CloudFrontHeaders, name: string): string | undefined {
  if (!headers.cookie) {
    return;
  }
  const cookies = headers.cookie.map(pair => cookieStrToObj(pair.value));
  const matchedCookie = cookies.reverse().find(cookie => name in cookie);
  return matchedCookie ? matchedCookie[name] : undefined;
}

export function cookieStrToObj(cookieStr: string): Cookies {
  return cookieStr.split(';').reduce(
    (res, keyValuePair) => {
      const splitCookie = keyValuePair.split('=').map(part => part.trim());
      res[splitCookie[0]] = splitCookie[1];
      return res;
    },
    {} as Cookies
  );
}

export function hasCookie(headers: CloudFrontHeaders, name: string): boolean {
  return headers.cookie && headers.cookie.find(cookie => cookie.value.indexOf(name) >= 0) != null;
}

export function setCookie(headers: CloudFrontHeaders, name: string, value: string) {
  const cookie = `${name}=${value}`;
  headers.cookie = [...(headers.cookie || []), { key: 'Cookie', value: cookie }];
}

export function setCookieOnResponse(
  cloudFrontResponse: CloudFrontResponse,
  name: string,
  value: string,
  cookiePath: string
) {
  const cookieValue = `${name}=${value}; Path=${cookiePath}`;
  cloudFrontResponse.headers['set-cookie'] = [{ key: 'Set-Cookie', value: cookieValue }];
}
