import type { DetailedHTMLProps, HTMLAttributes } from "react";

type EurekaWidgetProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    "api-key"?: string;
    lang?: string;
  },
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "eureka-chat-widget": EurekaWidgetProps;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "eureka-chat-widget": EurekaWidgetProps;
    }
  }
}

export {};
