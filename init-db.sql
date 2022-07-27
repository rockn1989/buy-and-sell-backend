DROP DATABASE IF EXISTS buyandsell;
DROP ROLE IF EXISTS admin;

CREATE DATABASE buyandsell WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';

CREATE user admin with encrypted password '1234';
GRANT all privileges on database buyandsell to admin;

ALTER DATABASE buyandsell OWNER TO admin;


