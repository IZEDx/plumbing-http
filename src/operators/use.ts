
import Koa, { Middleware } from "koa";
import { Operator, through } from "plumbing-toolkit";

export function use(middleware: Middleware): Operator<Koa, Koa>
{
    return  through((app, outlet) => {
        app.use(middleware);
        outlet.next(app);
    });
}
