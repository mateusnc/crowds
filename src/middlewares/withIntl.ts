import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Middleware } from ".";
import { i18n } from "@/i18n";

export function withIntl(next: Middleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    let locale = request.cookies.get("locale")?.value;
    if (!locale) {
      locale = request.headers
        .get("accept-language")
        ?.split(",")[0]
        ?.split("-")[0];
    }
    if (!locale || !i18n.supportedLanguages.includes(locale)) {
      locale = i18n.defaultLanguage;
    }

    if (!request.cookies.get("locale")) {
      response.cookies.set("locale", locale, {
        path: "/",
      });
    }

    return next(request, event, response);
  };
}
