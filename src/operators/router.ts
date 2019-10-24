
import Koa from "koa";
import Router from "koa-router";
import { Operator, through, MaybePromise } from "plumbing-toolkit";

export type RouteContext = Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>;
export type RoutePath = string | RegExp | (string | RegExp)[];
export type RouteMiddleware = (context: RouteContext, next: () => Promise<any>) => any;
export type RouteHandler = ((ctx: RouteContext) => MaybePromise<Partial<RouteContext>>);

export interface Route<M extends "GET"|"POST"|"PUT"|"DELETE">
{
    path: RoutePath;
    method: M;
    handlers: RouteHandler[];
}


export const get    = (path: RoutePath, ...handlers: RouteHandler[]): Route<"GET">       => ({ method: "GET", handlers, path });
export const post   = (path: RoutePath, ...handlers: RouteHandler[]): Route<"POST">      => ({ method: "POST", handlers, path });
export const put    = (path: RoutePath, ...handlers: RouteHandler[]): Route<"PUT">       => ({ method: "PUT", handlers, path });
export const del    = (path: RoutePath, ...handlers: RouteHandler[]): Route<"DELETE">    => ({ method: "DELETE", handlers, path });

export function router(opts?: Router.IRouterOptions): (...routes: Route<any>[]) => Operator<Koa, Koa>
{
    return (...routes) => through((app, outlet) => {
        const router = new Router(opts);
        for (const route of routes) {

            const middlewares: RouteMiddleware[] = route.handlers.map(m => {
                return async ctx => {
                    Object.assign(ctx, m(ctx))
                }
            });

            switch (route.method)
            {
                case "GET": router.get(route.path, ...middlewares); break;
                case "POST": router.post(route.path, ...middlewares); break;
                case "PUT": router.put(route.path, ...middlewares); break;
                case "DELETE": router.delete(route.path, ...middlewares); break;
            }
        }
        app.use(router.routes());
        outlet.next(app);
    });
}
