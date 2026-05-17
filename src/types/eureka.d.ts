import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "eureka-chat-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "api-key"?: string;
          lang?: string;
        },
        HTMLElement
      >;
    }
  }
}
