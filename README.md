# Read data from BigQuery
This cloud functions makes a sql query to BigQuery and the result can be be used in a webapp or mobile app 

### Setting up

Set the `bigquery.datasetname` and `bigquery.tablename` Google Cloud environment variables to match the Dataset name and the Table name where you want the logs written to. For this use:

## Deploy

`firebase functions:config:set bigquery.datasetname="<yourdataset>" bigquery.tablename="<your table>"`

Please deploy your functions for the change to take effect by running firebase deploy --only functions

`firebase deploy --only functions:getReportData`