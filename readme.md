# Light library for work with bpium api

## Simple usage 

```es7
import RecordModel from 'bpium-node-record-model';

// scheme
const MY_CATALOG_ID = '10';
const MY_CATALOG = {
  MY_TEXT_FIELD: '1'
  MY_DATE_FIELD: '2'
};

class MyRecord extends RecordModel {
  get FIELD_TYPES() {
    return {
      [MY_CATALOG.MY_DATE_FIELD]: 'date'
    }
  }
}

const myCatalogRecords = new MyRecord(
  'https://my-company.bpium.ru', 
  {login: 'apiLogin', password: 'apiPassword'},
  MY_CATALOG_ID
);

// ... in async function   
const {id: myRecordId} = await myCatalogRecords.create({
  [MY_CATALOG.MY_TEXT_FIELD]: 'text1',
  [MY_CATALOG.MY_DATE_FIELD]: new Date
});

await myCatalogRecords.update(myRecordId, {
  [MY_CATALOG.MY_TEXT_FIELD]: 'text2',
  [MY_CATALOG.MY_DATE_FIELD]: new Date
});

await myCatalogRecords.findOne({
  id: myRecordId
});

await myCatalogRecords.findOne({
  [MY_CATALOG.MY_TEXT_FIELD]: 'text2'
});

await myCatalogRecords.findAll({
  [MY_CATALOG.MY_TEXT_FIELD]: 'text2'
});

await myCatalogRecords.remove({
  [MY_CATALOG.MY_TEXT_FIELD]: 'text2'
});
```
