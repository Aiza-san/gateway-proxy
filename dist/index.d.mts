import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';

declare class GatewayError extends Error {
    status: number;
    headers?: AxiosResponse['headers'];
    data?: any;
    constructor({ message, headers, data, status, }: {
        message: string;
        headers?: AxiosResponse['headers'];
        data?: any;
        status?: number;
    });
}
declare class Gateway<Services extends Record<string, string | AxiosRequestConfig | AxiosInstance>> {
    private services;
    constructor(services: Services, globalHeaders?: Record<string, string | string[]>);
    send<Data = any>(serviceName: keyof Services, config?: AxiosRequestConfig): Promise<{
        data: Data;
        headers: AxiosResponse['headers'];
        status: number;
    }>;
}

export { GatewayError, Gateway as default };
