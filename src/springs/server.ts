
import { Outlet, pipe, IPipe, maybeAwait } from "plumbing-toolkit";
import Koa from "koa";

export function server(): IPipe<Koa>
{
    return pipe((outlet: Outlet<Koa>) =>
    {
        const app = new Koa();
        (async () => {
            await maybeAwait(outlet.next(app));
            outlet.complete();
        })();
        return () => {
            app.emit("pluck");
        }
    });
}
