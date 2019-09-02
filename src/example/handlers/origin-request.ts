import { OriginRequestTrigger } from "../../triggers/origin-request-trigger";
import { ExampleSourceDelegate } from "../example-source-delegate";

const factory = () => {
  const delegate = new ExampleSourceDelegate();
  return new OriginRequestTrigger(delegate);
};
export const handler = factory().handler;
