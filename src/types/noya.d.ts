import type { DetailedHTMLProps, HTMLAttributes } from "react";

type NoyaWidgetProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    "api-key"?: string;
    lang?: string;
  },
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "noya-chat": NoyaWidgetProps;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "noya-chat": NoyaWidgetProps;
    }
  }
}

export {};
