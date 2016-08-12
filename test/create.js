import assert from 'assert';
import {models, expectRequest} from './server';

describe('create', function () {
  it('should create record', function () {
    const createdId = '1';
    const createRecord = {
      model: {
        "1": 10,
        "2": "text1",
        "3": new Date("2016-08-10T12:12:25.437Z")
      },
      api: {
        "values": {
          "1": 10,
          "2": "text1",
          "3": "2016-08-10T12:12:25.437Z"
        }
      }
    };

    expectRequest('POST', '/', {}, {status: 201, body: function(uri, requestBody) {
      assert.deepEqual(requestBody, createRecord.api);
      return {id: createdId}
    }});

    return models.create(createRecord.model).then(({id})=> {
      return assert.strictEqual(id, createdId);
    });
  });
});
