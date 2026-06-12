import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { initI18n } from "./i18n";
import config from "./utils/config";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const lang = process.env.APP_LANG || config.lang;
  initI18n(lang);

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Content-Language", lang);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}