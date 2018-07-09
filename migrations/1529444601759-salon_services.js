const config = require('../src/lib/config')
const { connect } = require('../src/lib/database')

module.exports.up = async () => {
  const client = await connect()

  await client.query(`CREATE TABLE IF NOT EXISTS salon_services
  (
    id serial,
    salon_id integer NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    data json,
    created TIMESTAMPTZ NOT NULL,
    updated TIMESTAMPTZ NOT NULL,
    CONSTRAINT salon_services_id_pkey PRIMARY KEY (id)
  );`)

  client.release();
}

module.exports.down = async () => {
  const client = await connect()

  await client.query(`DROP TABLE salon_services;`)
  await client.release();
}