CREATE USER DAN WITH PASSWORD 'Daily-test';

CREATE DATABASE JAVAEEDB;

GRANT CONNECT, TEMPORARY ON DATABASE JAVAEEDB TO PUBLIC;
GRANT ALL ON DATABASE JAVAEEDB TO DAN;