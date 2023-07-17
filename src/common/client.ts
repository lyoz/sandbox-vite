const request = async (input: RequestInfo | URL, init?: RequestInit) => {
	const config = {
		headers: { "Content-Type": "application/json" },
		...init,
	} satisfies RequestInit;

	try {
		const response = await fetch(input, config);
		const data = await response.json();
		if (response.ok) {
			return {
				status: response.status,
				data,
				headers: response.headers,
				url: response.url,
			};
		}
		throw new Error(response.statusText);
	} catch (err) {
		return Promise.reject(err instanceof Error ? err.message : err);
	}
};

export const client = {
	get: (input: RequestInfo | URL) => {
		return request(input, { method: "GET" });
	},
	post: (input: RequestInfo | URL, body?: BodyInit | null) => {
		return request(input, { method: "POST", body });
	},
};
