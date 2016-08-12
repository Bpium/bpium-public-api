import nock from 'nock';

import RecordModel from '../';

const serverUrl = 'http://my-bpium-server-url';

const login = 'admin';
const password = 'admin';

const catalogId = '1';

class MyModel extends RecordModel {
  get FIELD_TYPES() {
    return {
      '3': 'date'
    }
  }
}

export const models = new MyModel(serverUrl, {login, password}, catalogId);

const server = nock(serverUrl).defaultReplyHeaders({
  'Content-Type': 'application/json'
});

export function expectRequest(method, url, query, {status, body}) {
  let chain = server;

  if (method !== 'GET') {
    chain = chain.matchHeader('accept', 'application/json')
  }

  chain
    .matchHeader('accept', 'application/json')
    .intercept(`/api/v1/catalogs/${catalogId}/records` + url, method)
    .basicAuth({
      user: login,
      pass: password
    })
    .query(query)
    .once()
    .reply(status || 200, body);
}
