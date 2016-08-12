import assert from 'assert';
import {models, expectRequest} from './server';
import records from './records';

describe('find all', function () {
  it('should return all records', function () {
    expectRequest('GET', '/', {}, {status: 200, body: records.api});

    return models.findAll()
      .then(res=> assert.deepEqual(res, records.models));
  });

  it('should find records by field 2', function () {
    const fieldId = '2';
    const value = 'text2';

    expectRequest('GET', '/', {filters: [{fieldId, value}]}, {body: [records.api[1]]});

    return models.findAll({[fieldId]: value})
      .then(res=> assert.deepEqual(res, [records.models[1]]));
  });
});
