import { Outlet, error, map, forEach } from "plumbing-toolkit";
import { server } from "./springs/server";
import { listen } from "./operators/listen";
import { router, get, respond } from "./operators/router";
import { fetch } from "./operators";

const myServer = server().chain(
    router()(
        get("/", req => req.chain(
            map(ctx => ctx.query),
            fetch.get<{foo: string}>({
                url: "http://www.mocky.io/v2/5db23725350000e117f54f0a"
            }),
            forEach(r => console.log(r.data.foo)),
            error((err, outlet) => {
                outlet.next({
                    data: err.toString()
                } as any)
            }),
            respond(res => ({
                body: res.data
            }))
        ))
    ),
    listen(8080)
);

myServer.flush(Outlet.to(
    server => {
        console.log("Server listening on port 8080");
        setTimeout(() => server.close(), 60000); // Stop after 60 seconds
    }, 
    err => {
        console.log("Error starting the server");
        console.error(err);
    }
));