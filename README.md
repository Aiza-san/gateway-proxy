# Gateway Proxy

Easy Gateway is a simple and comfortable way to interact with API services from the Gateway. Its approach allows for simple configuration and simple handling of errors that may occur.

To maintain good practices, Easy Gateway actively uses Axios, so if you don't know Axios now is a good time to learn it.

## Quick Start

1. Create Gateway Instance

```ts
import Gateway, { GatewayError } from 'gateway-proxy'

const gateway = new Gateway({
	users: 'http://localhost:3001/',
	tasks: {
		baseURL: 'http://localhost:3002/',
		// ...config
	},
})
```

2. Use Gateway Instance

```ts
const example = async () => {
	const users = await gateway.send('users' /* { ...config } */)
	console.log(users.data)
	const tasks = await gateway.send('tasks', {
		url: '/task-1',
	})
	console.log(tasks.data)
}
```

3. Error Handling

```ts
example().catch(err => {
	if (err instanceof GatewayError) {
		console.log(err.status)
		console.log(err.message)
		console.log(err.headers)
		console.log(err.data)
	}
})
```

## License

Licensed under [MIT](https://github.com/aiza-san/easy-gateway/blob/main/LICENSE.md).
