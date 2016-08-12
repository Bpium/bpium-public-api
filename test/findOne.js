import assert from 'assert';
import {models, expectRequest} from './server';
import records from './records';

describe('find by id', function () {

  it('should return record by id', function () {
    const recordId = '1';

    expectRequest('GET', '/' + recordId, {}, {body: records.api[0]});

    return models.findOne({id: '1'})
      .then(res=> assert.deepEqual(res, records.models[0]));
  });

  it('should find record by field 2', function () {
    const fieldId = '2';
    const value = 'text2';
    
    expectRequest('GET', '/', {filters: [{fieldId, value}]}, {body: [records.api[1]]});

    return models.findOne({[fieldId]: value})
      .then(res=> assert.deepEqual(res, records.models[1]));
  });
});
