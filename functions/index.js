const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bigquery = require('@google-cloud/bigquery');
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

const db = admin.database();

/**
 * Query bigquery with the last 7 days of data
 * HTTPS endpoint to be used by the webapp
 */
exports.getReportData = functions.https.onRequest((req, res) => {
  const projectId = process.env.GCLOUD_PROJECT;
  const datasetName = functions.config().bigquery.datasetname;
  const tableName = functions.config().bigquery.tablename;
  const table = `${projectId}.${datasetName}.${tableName}`;

  const query = `
    SELECT 
      TIMESTAMP_TRUNC(data.timestamp, HOUR, 'Europe/Amsterdam') data_hora,
      avg(data.temp) as avg_temp,
      avg(data.humidity) as avg_hum,
      min(data.temp) as min_temp,
      max(data.temp) as max_temp,
      min(data.humidity) as min_hum,
      max(data.humidity) as max_hum,
      count(*) as data_points      
    FROM \`${table}\` data
    WHERE data.timestamp between timestamp_sub(current_timestamp, INTERVAL 7 DAY) and current_timestamp()
    group by data_hora
    order by data_hora
  `;

  return bigquery
    .query({
      query: query,
      useLegacySql: false
    })
    .then(result => {
      const rows = result[0];

      cors(req, res, () => {
        res.json(rows);
      });
    });
});