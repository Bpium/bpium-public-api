import assert from 'assert';
import {models, expectRequest} from './server';

describe('remove', function () {
  it('should remove record', function () {
    const recordId = '1';

    expectRequest('DELETE', '/' + recordId, {}, {status: 200});

    return models.remove(recordId);
  });
});
