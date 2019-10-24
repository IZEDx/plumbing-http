import { Outlet } from "plumbing-toolkit";
import { server } from "./springs/server";
import { listen } from "./operators/listen";
import { router, get } from "./operators/router";

const myServer = server().chain(
    router()(
        get("/", (ctx) => ({
            body: "Hello World"
        }))
    ),
    listen(8080)
);

myServer.flush(Outlet.to(
    server => {
        console.log("Server listening on port 8080");
        setTimeout(() => server.close(), 10000); // Stop after 10 seconds
    }, 
    err => {
        console.log("Error starting the server");
        console.error(err);
    }
));