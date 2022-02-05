'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies


const dynamoDb = new AWS.DynamoDB.DocumentClient();
var csd = new AWS.CloudSearchDomain({
  endpoint: 'search-product-search-pplty4wshg7t7t3tv7hqypgb6y.us-east-1.cloudsearch.amazonaws.com',
  apiVersion: '2013-01-01'
});

module.exports.stateSearch = (event, context, callback) => {
  // const params = {
  //   TableName: "Products",
  //   Key: {
  //     ID: event.pathParameters.id,
  //   },
  // };
  
  const params2 = {
    query: event.pathParameters.id, /* required */
 //   query: 'april',
 //     query: queryString,
  //  cursor: 'STRING_VALUE',
  //  expr: 'STRING_VALUE',
  //  facet: 'STRING_VALUE',
      facet: {"USstates":{"sort":"count","size":50}},
  //  filterQuery: '(accountActive:\'T\')',
  //  filterQuery: "accountActive :'T'",
   filterQuery: 'accountactive :\'T\'',
  //  highlight: 'STRING_VALUE',
  //  partial: true || false,
  //  queryOptions: {defaultOperator:and,},
  //  queryParser: simple | structured | lucene | dismax,
   queryParser: 'simple',
  // filterQuery: 'accountActive :&quot;T&quot;',
  return: 'username,contact,description,occupation,id',
 //    return: 'name,contact',
    // return: 'description',
    // return: 'occupation',
    // return: 'id',
     size: '25'
  //  sort: 'STRING_VALUE',
  //  start: 'NUMBER_VALUE',
  //  stats: 'STRING_VALUE'
  };

  // fetch todo from the database
  // dynamoDb.get(params, (error, result) => {
  //   // handle potential errors
  //   if (error) {
  //     console.error(error);
  //     callback(null, {
  //       statusCode: error.statusCode || 501,
  //       headers: { 'Content-Type': 'text/plain' },
  //       body: 'Couldn\'t fetch the todo item.',
  //     });
  //     return;
  //   }

  //   // create a response
  //   const response = {
  //     statusCode: 200,
  //     body: JSON.stringify(result.Item),
      
  //   };
  //   callback(null, response);
  // });

 // csd.search(params2, function(err, data) {
  csd.search(params2, (err, data) => {
    if (err) {
        callback('CloudSearch ERROR');
        context.done();
    }
    else {
      const response = {
        statusCode: 200,
   //    body: JSON.stringify(data.Item),
       body: JSON.stringify(data),
  
   //       body: 'test text',
        
      };
        callback(null, response); // SUCCESS
        context.done();
    }
});

};
