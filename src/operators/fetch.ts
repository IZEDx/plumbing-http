import { Operator, through } from "plumbing-toolkit";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

function _fetch<T>(configOrUrl?: AxiosRequestConfig|string, dataKey: keyof AxiosRequestConfig = "params"): Operator<any, AxiosResponse<T>>
{
    return through(async (urlOrData, output) => {
        let response: AxiosResponse<T>;
        if (typeof configOrUrl === "string") {
            response = await axios.get(configOrUrl, {
                params: urlOrData
            });
        } else if(typeof urlOrData === "string") {
            response = await axios.get(urlOrData, configOrUrl);
        } else {
            response = await axios.get(configOrUrl!.url!, {
                ...configOrUrl!,
                [dataKey]: urlOrData
            });
        }
        await output.next(response);
    });
}

export function fetch<T, I>(configOrUrl: string|(AxiosRequestConfig&{url: string}), dataKey?: keyof AxiosRequestConfig): Operator<I, AxiosResponse<T>>;
export function fetch<T>(config?: AxiosRequestConfig, dataKey?: keyof AxiosRequestConfig): Operator<string, AxiosResponse<T>>
export function fetch<T>(configOrUrl?: AxiosRequestConfig|string, dataKey: keyof AxiosRequestConfig = "params"): Operator<any, AxiosResponse<T>>
{
    return _fetch(configOrUrl, dataKey);
}

export namespace fetch 
{
    export function get<T, I>(configOrUrl: string|(AxiosRequestConfig&{url: string})): Operator<I, AxiosResponse<T>>;
    export function get<T>(config?: AxiosRequestConfig): Operator<string, AxiosResponse<T>>
    export function get<T>(configOrUrl?: AxiosRequestConfig|string): Operator<any, AxiosResponse<T>>
    {
        return _fetch(configOrUrl, "params");
    }
    
    export function post<T, I>(configOrUrl: string|(AxiosRequestConfig&{url: string})): Operator<I, AxiosResponse<T>>;
    export function post<T>(config?: AxiosRequestConfig): Operator<string, AxiosResponse<T>>
    export function post<T>(configOrUrl?: AxiosRequestConfig|string): Operator<any, AxiosResponse<T>>
    {
        return _fetch(configOrUrl, "data");
    }
    
    export function put<T, I>(configOrUrl: string|(AxiosRequestConfig&{url: string})): Operator<I, AxiosResponse<T>>;
    export function put<T>(config?: AxiosRequestConfig): Operator<string, AxiosResponse<T>>
    export function put<T>(configOrUrl?: AxiosRequestConfig|string): Operator<any, AxiosResponse<T>>
    {
        return _fetch(configOrUrl, "data");
    }
    
    export function del<T, I>(configOrUrl: string|(AxiosRequestConfig&{url: string})): Operator<I, AxiosResponse<T>>;
    export function del<T>(config?: AxiosRequestConfig): Operator<string, AxiosResponse<T>>
    export function del<T>(configOrUrl?: AxiosRequestConfig|string): Operator<any, AxiosResponse<T>>
    {
        return _fetch(configOrUrl, "params");
    }
}
