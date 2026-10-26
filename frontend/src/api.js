let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

async function sendRequest(path, options = {}, retry = true) {
  const headers = new Headers(options.headers || {});
  const body = options.body;
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken && !options.public) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`/api/v1${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: body === undefined || isForm || typeof body === 'string' ? body : JSON.stringify(body),
  });

  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    try {
      await refreshAccessToken();
      return sendRequest(path, options, false);
    } catch {
      setAccessToken(null);
    }
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(result?.error?.message || 'The request could not be completed.');
    error.status = response.status;
    error.code = result?.error?.code;
    throw error;
  }
  return result?.data;
}

export function api(path, options = {}) {
  return sendRequest(path, options);
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = sendRequest('/auth/refresh', { method: 'POST', public: true }, false)
      .then((data) => {
        setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}