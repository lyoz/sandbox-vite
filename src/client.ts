const request = async (
  endpoint: string,
  method: "GET" | "POST",
  body?: object
) => {
  try {
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body && JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        status: res.status,
        data,
        headers: res.headers,
        url: res.url,
      };
    }
    throw new Error(res.statusText);
  } catch (err) {
    return Promise.reject(err instanceof Error ? err.message : err);
  }
};

export const client = {
  get: async (endpoint: string) => {
    return request(endpoint, "GET");
  },
  post: async (endpoint: string, body: object) => {
    return request(endpoint, "POST", body);
  },
};
