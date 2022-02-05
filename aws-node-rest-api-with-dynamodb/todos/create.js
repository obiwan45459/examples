'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
var csd = new AWS.CloudSearchDomain({
  endpoint: 'search-business-search-7swaoxjyhqtx5sfk24yryfxg4a.us-east-1.cloudsearch.amazonaws.com',
  apiVersion: '2013-01-01'
});

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(':');
  const userPoolIdParts = parts[parts.length - 3].split('/');

  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  // if (typeof data.text !== 'string') {
  //   console.error('Validation Failed');
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: 'Couldn\'t create the todo item.',
  //   });
  //   return;
  // }

  const params = {
    // TableName: process.env.DYNAMODB_TABLE,
    // Item: {
    //   id: uuid.v1(),
    //   text: data.text,
    //   checked: false,
    //   createdAt: timestamp,
    //   updatedAt: timestamp,
    // },

    TableName: "Products",
    Item: {
  //  ID: uuid.v1(),
    ID: userPoolUserId,
    username: data.name,
    description: data.description,
    contact: data.contact,
    occupation: data.occupation,
    accountActive: 'T',
    //zipCode: data.zipCode,
    USstate: data.state,
    city: data.city,
  //  UserPoolID: event,
  //  Context: context,
  //  UserPoolUserID: userPoolUserId,
  //  EventAuth: event.requestContext.authorizer,
  //  CognitoID: 
  //  CognitoID: event.requestContext.authorizer.claims
  //  accountActive: data.accountActive,
   // imageURL: data.imageURL
    },
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


  // context.CognitoIdentityServiceProvider.

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
