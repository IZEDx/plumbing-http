
import Koa from "koa";
import { Server, createServer } from "http";
import { through, Operator } from "plumbing-toolkit";

export function listen(port: number): Operator<Koa, Server>
{
    return through((app, outlet) => new Promise((res, rej) => {
        const server = createServer(app.callback()).listen(port, () => {
            outlet.next(server)
            res();
        });
        app.addListener("pluck", () => server.close(err => {
            if (err) rej(err);
        }));
    }));
}