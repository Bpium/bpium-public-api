import assert from 'assert';
import {models, expectRequest} from './server';

describe('update', function () {
  it('should update record', function () {
    const recordId = '1';
    const updateRecord = {
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

    expectRequest('PATCH', '/' + recordId, {}, {status: 200, body: function(uri, requestBody) {
      assert.deepEqual(requestBody, updateRecord.api);
    }});

    return models.update(recordId, updateRecord.model);
  });
});
