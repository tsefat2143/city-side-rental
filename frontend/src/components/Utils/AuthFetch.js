export const authFetch = async (url, options = {}, auth) => {
  let token = auth.accessToken || localStorage.getItem("accessToken");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  };

  let res = await fetch(url, config);

  //If unauthorized refresh and retry
  if (res.status === 401 || res.status === 403) {
    const newToken = await auth.refreshAccessToken();

    if (!newToken) {
      throw new Error("Session expired");
    }

    const retryConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${newToken}`,
      },
    };

    res = await fetch(url, retryConfig);
  }

  return res;
};