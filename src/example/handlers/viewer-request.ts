import { ViewerRequestTrigger } from '../../triggers/viewer-request-trigger';
import { ExampleSourceDelegate } from '../example-source-delegate';

const factory = () => {
  const delegate = new ExampleSourceDelegate();
  return new ViewerRequestTrigger(delegate);
};
export const handler = factory().handler;
