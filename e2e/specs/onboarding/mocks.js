import { getDecodedProxiedURL } from '../../identity/utils/helpers';

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
