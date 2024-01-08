import axios, { type AxiosResponse, type AxiosInstance, type AxiosRequestConfig, AxiosError } from 'axios'

export class GatewayError extends Error {
	status: number
	headers?: AxiosResponse['headers']
	data?: any

	constructor({
		message,
		headers,
		data,
		status = 500,
	}: {
		message: string
		headers?: AxiosResponse['headers']
		data?: any
		status?: number
	}) {
		super(message)
		this.headers = headers
		this.status = status
		this.data = data
	}
}

export default class Gateway<Services extends Record<string, string | AxiosRequestConfig | AxiosInstance>> {
	private services: Services

	constructor(services: Services, globalHeaders: Record<string, string | string[]> = {}) {
		for (const keyName in services) {
			const service = services[keyName]
			if (typeof service === 'string') {
				const instance = axios.create({
					baseURL: service,
					headers: globalHeaders,
				})
				services[keyName] = instance as Services[Extract<keyof Services, string>]
				continue
			}
			if (typeof service === 'object') {
				const { headers = {}, ...config } = service
				const instance = axios.create({
					headers: { ...globalHeaders, ...headers },
					...config,
				})
				services[keyName] = instance as Services[Extract<keyof Services, string>]
				continue
			}
		}
		this.services = services
	}

	async send<Data = any>(
		serviceName: keyof Services,
		config: AxiosRequestConfig = {}
	): Promise<{ data: Data; headers: AxiosResponse['headers']; status: number }> {
		const service = this.services[serviceName]
		if (typeof service === 'string' || typeof service === 'object') throw new Error('')
		return await new Promise((resolve, reject) => {
			service(config)
				.then(res => {
					resolve({ headers: res.headers, data: res.data, status: res.status })
				})
				.catch(error => {
					if (error instanceof AxiosError) {
						if (error.response) {
							reject(
								new GatewayError({
									message: error.response.statusText,
									status: error.response.status,
									headers: error.response.headers,
									data: error.response.data,
								})
							)
						}
						reject(new GatewayError({ message: 'BAD_GATEWAY', status: 502 }))
					}
					reject(new GatewayError({ message: 'INTERNAL_SERVER_ERROR' }))
				})
		})
	}
}
