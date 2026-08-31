function getApiBaseCandidates() {
  const hostname = window.location.hostname || 'localhost';
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrls = new Set();

  if (window.location.origin) {
    baseUrls.add(window.location.origin);
  }

  baseUrls.add(`${protocol}://${hostname}`);
  baseUrls.add(`${protocol}://localhost`);
  baseUrls.add(`${protocol}://127.0.0.1`);

  const variants = [];
  baseUrls.forEach((base) => {
    variants.push(`${base}/api`);
    variants.push(`${base}:3001/api`);
    variants.push(`${base}:5173/api`);
    variants.push(`${base}:80/api`);
  });

  return [...new Set(variants)];
}

async function fetchJsonWithFallback(url, options) {
  const candidates = options?.method === 'POST'
    ? [url, ...getApiBaseCandidates().map((base) => `${base}/data`)]
    : getApiBaseCandidates().map((base) => `${base}/data`);

  const requestUrl = candidates.find((candidate) => candidate.startsWith('http')) || url;
  const finalCandidates = [requestUrl, ...(candidates.filter((candidate) => candidate !== requestUrl))];

  let lastError;
  for (const candidate of finalCandidates) {
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
  return fetchJsonWithFallback(`${getApiBaseCandidates()[0]}/data`);
}

export async function checkNetworkAccess() {
  return fetchJsonWithFallback(`${getApiBaseCandidates()[0]}/access`);
}

export async function fetchNetworkInfo() {
  return fetchJsonWithFallback(`${getApiBaseCandidates()[0]}/access`);
}

export async function saveSharedData(data) {
  return fetchJsonWithFallback(`${getApiBaseCandidates()[0]}/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
