function getApiBase() {
  const hostname = window.location.hostname || 'localhost';
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const localBackendPort = window.location.port === '5173' ? ':3001' : '';
  return `${protocol}://${hostname}${localBackendPort}/api`;
}

export async function fetchSharedData() {
  const response = await fetch(`${getApiBase()}/data`);
  if (!response.ok) {
    throw new Error('Unable to load shared data');
  }
  return response.json();
}

export async function checkNetworkAccess() {
  const response = await fetch(`${getApiBase()}/access`);
  if (!response.ok) {
    throw new Error('Unable to check network access');
  }
  return response.json();
}

export async function fetchNetworkInfo() {
  const response = await fetch(`${getApiBase()}/access`);
  if (!response.ok) throw new Error('Unable to load network information');
  return response.json();
}

export async function saveSharedData(data) {
  const response = await fetch(`${getApiBase()}/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Unable to save shared data');
  }

  return response.json();
}
