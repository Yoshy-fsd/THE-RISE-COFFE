function getApiBaseCandidates() {
  const hostname = window.location.hostname || 'localhost';
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';

  return [
    `${protocol}://localhost:3001/api`,
    `${protocol}://127.0.0.1:3001/api`,
    `${protocol}://${hostname}:3001/api`,
    `${protocol}://${hostname}/api`,
    `${protocol}://localhost/api`,
    `${protocol}://127.0.0.1/api`,
    `${window.location.origin.replace(/:\d+$/, '')}/api`,
  ].filter(Boolean, new Set());
}

async function fetchJsonWithFallback(path, options) {
  const candidates = [...new Set(getApiBaseCandidates().map((base) => `${base}${path}`))];
  let lastError;

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, options);
      if (!response.ok) {
        lastError = new Error(`Request failed with status ${response.status}`);
        continue;
      }
      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to load shared data');
}

export async function fetchSharedData() {
  return fetchJsonWithFallback('/data');
}

export async function checkNetworkAccess() {
  return fetchJsonWithFallback('/access');
}

export async function fetchNetworkInfo() {
  return fetchJsonWithFallback('/access');
}

export async function saveSharedData(data) {
  return fetchJsonWithFallback('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
