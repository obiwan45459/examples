'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const params = {
// //  TableName: process.env.DYNAMODB_TABLE,
//     TableName: "ZipCodes",
//     FilterExpression: 'zipCode = :value',
//     ExpressionAttributeValues: { 
//     ':value': 'T',
//   }
//     // Key: {
//     //   id: event.pathParameters.id,
//     // }
// };

module.exports.searchZip = (event, context, callback) => {
  // fetch all todos from the database

  //const params = {
    //  TableName: process.env.DYNAMODB_TABLE,
    //     TableName: "Products",
    //     Key: {
    //       ID: event.pathParameters.id,
    //     }
    // };

    const params = {
      //  TableName: process.env.DYNAMODB_TABLE,
          TableName: "ZipCodes",
          FilterExpression: 'zipCode = :value',
          ExpressionAttributeValues: { 
          ':value': event.pathParameters.zipcode,
        }
          // Key: {
          //   id: event.pathParameters.id,
          // }
      };

  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
    //    body: false,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
   //   body: true,
    };
    callback(null, response);
  });
};
