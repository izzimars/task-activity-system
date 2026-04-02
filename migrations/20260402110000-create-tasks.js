'use strict';
var fs = require('fs');
var path = require('path');

exports.up = function(db) {
  var sql = fs.readFileSync(path.join(__dirname, 'sqls', '20260402110000-create-tasks-up.sql'), 'utf-8');
  return db.runSql(sql);
};

exports.down = function(db) {
  var sql = fs.readFileSync(path.join(__dirname, 'sqls', '20260402110000-create-tasks-down.sql'), 'utf-8');
  return db.runSql(sql);
};
