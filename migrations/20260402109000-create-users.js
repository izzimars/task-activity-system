'use strict';
var fs = require('fs');
var path = require('path');

exports.up = function(db) {
  var sql = fs.readFileSync(path.join(__dirname, 'sqls', '20260402109000-create-users-up.sql'), 'utf-8');
  return db.runSql(sql);
};

exports.down = function(db) {
  var sql = fs.readFileSync(path.join(__dirname, 'sqls', '20260402109000-create-users-down.sql'), 'utf-8');
  return db.runSql(sql);
};
