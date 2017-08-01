'use strict'

var sql = `
  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(255) UNIQUE,
  isManager BOOLEAN DEFAULT FALSE
);

  INSERT INTO users (name, isManager) VALUES ('Mr. Man', FALSE);
  INSERT INTO users (name, isManager) VALUES ('Mr. Manager', TRUE);
  INSERT INTO users (name, isManager) VALUES ('Ms. Woman', FALSE);
  INSERT INTO users (name, isManager) VALUES ('Ms. Womanager', TRUE);
`;

module.exports= { sql };
