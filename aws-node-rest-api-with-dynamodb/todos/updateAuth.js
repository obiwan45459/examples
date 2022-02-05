'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
var csd = new AWS.CloudSearchDomain({
  endpoint: 'search-business-search-7swaoxjyhqtx5sfk24yryfxg4a.us-east-1.cloudsearch.amazonaws.com',
  apiVersion: '2013-01-01'
});

module.exports.updateAuth = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(':');
  const userPoolIdParts = parts[parts.length - 3].split('/');

  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  // validation
  // if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
  //   console.error('Validation Failed');
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: 'Couldn\'t update the todo item.',
  //   });
  //   return;
  // }

//   const params = {
//  //   TableName: process.env.DYNAMODB_TABLE,
//   TableName: "Products",
//     Key: {
//       id: event.pathParameters.id,
//     },
//     ExpressionAttributeNames: {
//       '#todo_text': 'text',
//     },
//     ExpressionAttributeValues: {
//       ':text': data.text,
//       ':checked': data.checked,
//       ':updatedAt': timestamp,
//     },
//     UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
//     ReturnValues: 'ALL_NEW',
//   };

// const params = {
//   TableName: "Products",
//   Key: {
//     ID: event.pathParameters.id,
//   },
//   ExpressionAttributeNames: {
//     '#name': 'name',
//   },
//   ExpressionAttributeValues: {
//     ':name': data.name,
//   },
//   UpdateExpression: 'SET #name = :name',
//   ReturnValues: 'ALL_NEW',
// };

const params = {
  
  TableName: "Products",
  Key: {
   ID: userPoolUserId
// ID: "bb535ca0-1429-11ec-a64d-e300e82ed84c"
  },
  UpdateExpression: "set  username = :n, description = :d, city = :c, occupation = :o, contact = :con, USstate = :s",
    // ExpressionAttributeNames={
    // "#na": "name"
    //   },
    ExpressionAttributeValues:{
        ":n": data.name,
        ":d": data.description,
        ":c": data.city,
        ":con": data.contact,
        ":s": data.state,
        ":o": data.occupation
    },
    
 //   ReturnValues:"UPDATED_NEW"
//   Item: {
//   ID: event.pathParameters.id,
//   name: data.name,
//   description: data.description,
//   contact: data.contact,
//   occupation: data.occupation,
//   accountActive: 'T',
//   zipCode: data.zipCode,
//   state: data.state,
//   city: data.city
// //  accountActive: data.accountActive,
//  // imageURL: data.imageURL
//   },
};

var jbatch = [  {"type": "add",
                    "id": userPoolUserId,
                    "fields": {"accountactive": "T",
                              "city": data.city,
                              "contact": data.contact,
                              "description": data.description,
                              "id": userPoolUserId,
                              "name": data.name,
                              "occupation": data.occupation,
                              "username": data.name,
                              "usstate": data.state}, } ];
    
    var paramsCloudSearch = { contentType: 'application/json', documents: JSON.stringify(jbatch) };

    csd.uploadDocuments(paramsCloudSearch, function(err, data) {
      if (err) {
          console.log('CloudSearchDomain ERROR');
      }
      else {
          console.log('CloudSearchDomain SUCCESS');
      }
  });



  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
   //     body: 'Couldn\'t fetch the todo item. data.name = '+data.name +'   event.pathParameters.id = '+event.pathParameters.id +'  error message ='+error.message,
        body: 'Couldn\'t fetch the todo item. data.name = '+data.name +'  error message ='+error.message,

      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
