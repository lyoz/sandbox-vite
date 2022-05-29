const request = async (
  endpoint: string,
  method: "GET" | "POST",
  body?: object
) => {
  let data;
  try {
    const res = await fetch(endpoint, {
      method,
      body: body && JSON.stringify(body),
    });
    data = await res.json();
    return {
      status: res.status,
      data,
    };
  } catch (err) {
    return Promise.reject(err);
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
