import _ from 'lodash';
import request from 'request-promise';
import debug from 'debug';

import * as FIELD_TYPES from './const/fieldTypes';
import * as HTTP_METHODS from './const/httpMethods';

const log = debug('BpiumRecordRecordModel:');

const authParam = Symbol('authParam');

class RecordModel {
  constructor(serverUrl, {login, password}, catalogId) {
    if (!catalogId) {
      throw new Error(`catalogId can't be empty`);
    }

    this[authParam] = {user: login, pass: password};

    this.serverUrl = serverUrl;
    this.catalogId = catalogId;
  }

  _getResourceUrl(recordId = null) {
    return this.serverUrl + '/api/v1/catalogs/' + this.catalogId + '/records/' + (recordId || '');
  }

  _request({recordId, ...config}) {
    let options = _.assign({
      url: this._getResourceUrl(recordId),
      auth: {sendImmediately: true, ...this[authParam]},
      json: true
    }, config);

    let marker = _.uniqueId();

    log('Api request marker=%s method %s, url %s', marker, options.method, options.url, 'data: ', options.qs || options.body);

    return request(options).catch(function (err) {
      log('Api request marker=%s, error: ', marker, err && err.error || err);

      throw err;
    });
  }

  get FIELD_TYPES() {
    return {};
  }

  async findAll(params = {}) {
    let {id} = params;

    let baseParams = {method: HTTP_METHODS.GET};

    let records;

    if (id) {
      records = await this._request(_.assign({}, baseParams, {
        recordId: id
      }))
        .then(function (result) {
          return [result];
        })
        .catch(function (err) {
          let status = _.get(err, 'response.statusCode');

          if (status == 404) {
            return [];
          }

          throw err;
        });
    } else {
      records = await this._request(_.assign({}, baseParams, {
        qs: !params ? {} : {
          filters: _.map(params, function (value, fieldId) {
            return {
              fieldId,
              value
            };
          })
        }
      }));
    }

    return records.map(record=> {
      return {
        id: record.id,
        ..._.mapValues(record.values, (value, fieldId)=> {
          let fieldType = this.FIELD_TYPES[fieldId];

          if (fieldType === FIELD_TYPES.DATE) {
            return value ? new Date(value) : null;
          }

          return value;
        })
      };
    });
  }

  async findOne(params = {}) {
    if (!_.size(params)) {
      return new Error('Empty find request');
    }

    return _.head(await this.findAll(params));
  }

  async create(data = {}) {
    return this._request({
      method: HTTP_METHODS.POST,
      body: {
        values: data
      }
    });
  }

  async update(recordId, data = {}) {
    if (_.isObject(recordId)) {
      throw new Error(`recordId can't be empty`);
    }

    if (!_.size(data)) {
      return;
    }

    await this._request({
      recordId,
      method: HTTP_METHODS.PATCH,
      body: {
        values: data
      }
    });
  }

  async remove(recordId) {
    if (!recordId) {
      throw new Error(`recordId can't be empty`);
    }

    return this._request({
      recordId,
      method: HTTP_METHODS.DELETE
    });
  }
}

export default RecordModel;
