const couchbase = require('couchbase');
require('dotenv').config();

async function connectToCouchbase() {
  const clusterConnStr = process.env.COUCHBASE_URL;
  const username = process.env.COUCHBASE_USER;
  const password = process.env.COUCHBASE_PASSWORD;
  const bucketName = process.env.COUCHBASE_BUCKET;

  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
    configProfile: 'wanDevelopment',
  });

  const bucket = cluster.bucket(bucketName);
  const defaultCollection = bucket.defaultCollection();

  return { cluster, bucket, defaultCollection };
}

module.exports = connectToCouchbase;
