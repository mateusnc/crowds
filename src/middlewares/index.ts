import { NextMiddlewareResult } from "next/dist/server/web/types";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type Middleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

type MiddlewareFactory = (middleware: Middleware) => Middleware;

function chain(middlewares: MiddlewareFactory[], index = 0): Middleware {
  const current = middlewares[index];
  if (current) {
    const next = chain(middlewares, index + 1);
    return current(next);
  }

  return (
    _request: NextRequest,
    _event: NextFetchEvent,
    response: NextResponse
  ) => response;
}

function setup(middleware: Middleware) {
  return (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next();
    return middleware(request, event, response);
  };
}

export function withMiddlewares(middlewares: MiddlewareFactory[]) {
  return chain([setup, ...middlewares], 0);
}
