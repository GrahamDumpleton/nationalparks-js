var url = require('url');
var multipaas   = require('config-multipaas');

var autoconfig  = function (config_overrides){
  var config    = multipaas(config_overrides).add({
    uri: process.env.uri,
    username: process.env.username || process.env.MONGODB_USER || process.env.DB_USERNAME || 'mongodb',
    password: process.env.password || process.env.MONGODB_PASSWORD || process.env.DB_PASSWORD || 'mongodb',
    table_name: process.env.database_name || process.env.MONGODB_DATABASE || process.env.DB_NAME || 'mongodb',
    collection_name: process.env.database_name || process.env.MONGODB_DATABASE || process.env.DB_NAME || 'mongodb',
    db_autoload: process.env.DB_AUTOLOAD || "false",
    db_host: process.env.DB_HOST || "mongodb-nationalparks",
    db_port: process.env.DB_PORT || "27017",
    db_proto: process.env.DB_PROTO || "mongodb",
    db_svc_name: process.env.DATABASE_SERVICE_NAME || "mongodb"
  })

  console.log('CONFIG', config);

  var ws_info = {
    id: "nationalparks-js",
    displayName: "National Parks (JS)",
    type: "cluster",
    center: {'latitude': '47.039304', 'longitude': '14.505178'},
    zoom: 4
  };

  var creds = config.get('username')+':'+config.get('password')+'@';

  var db_config = undefined;

  if (config.get('uri')) {
    var db_uri = url.parse(config.get('uri'));
    console.log('DB_URI', db_uri);
    db_config = db_uri.protocol+'//'+creds+db_uri.hostname+":"+db_uri.port+"/";
  }
  else {
    db_config = config.get('db_proto')+'://'+creds+config.get('db_host')+":"+config.get('db_port')+"/";
  }

  table     = config.get('table_name');

  console.log('DB_CONFIG', db_config+table);

  config.add({db_config: db_config+table});
  config.add({wsinfo: JSON.stringify(ws_info)});
  return config;
}

exports = module.exports = autoconfig();
