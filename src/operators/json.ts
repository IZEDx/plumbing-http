import { Operator, through } from "plumbing-toolkit";

export namespace json 
{
    export function stringify(): Operator<any, string>
    {
        return through((v, outlet) => outlet.next(JSON.stringify(v)));
    }

    export function parse<T>(): Operator<string, T>
    {
        return through((v, outlet) => outlet.next(JSON.parse(v)));
    }
}
