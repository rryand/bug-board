const defaults = {
  baseURL: 'http://192.168.100.5:8000',
  headers: {
    'Content-type': 'application/json',
  },
}

const api = async (method, uri, body) => {
  const res = await fetch(`${defaults.baseURL}${uri}`, {
    method,
    headers: defaults.headers,
    body: (method === 'POST' || method === 'PATCH') ? 
      JSON.stringify(body) : undefined,
  });
  const data = await res.json();

  return data;
}

export default {
  get: (...args) => api('GET', ...args),
  post: (...args) => api('POST', ...args),
  patch: (...args) => api('PATCH', ...args)
}
