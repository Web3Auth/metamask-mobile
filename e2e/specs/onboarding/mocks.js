const getDecodedProxiedURL = (url) =>
  decodeURIComponent(String(new URL(url).searchParams.get('url')));

export const applyMock = (mockServer, mockData = []) => {
  for (const mock of mockData) {
    mockServer
      .forGet()
      .matching((request) => {
        const url = getDecodedProxiedURL(request.url);
        return url.includes(mock.urlEndpoint);
      }).thenCallback(() => ({
        statusCode: mock.responseCode,
        json: mock.response,
      }));
  }
};
