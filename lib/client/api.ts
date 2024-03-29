export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const doPostRequest = async (url: string, body?: any) => {
  return doRequest(url, 'POST', body);
};

export const doPutRequest = async (url: string, body?: any) => {
  return doRequest(url, 'PUT', body);
};

export const doDeleteRequest = async (url: string, body?: any) => {
  return doRequest(url, 'DELETE', body);
};

const doRequest = async (url: string, method: string, body?: any) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data?.message || 'Something went wrong.');
    }

    return data;
  } catch (error: any) {
    return { error: error.message };
  }
};
