import { OriginResponseTrigger } from "../../triggers/origin-response-trigger";
import { ExampleSourceDelegate } from "../example-source-delegate";

const factory = () => {
  const delegate = new ExampleSourceDelegate();
  return new OriginResponseTrigger(delegate);
};
export const handler = factory().handler;
