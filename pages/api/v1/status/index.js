import database from "infra/database.js"
async function status(request, response) {
  const databaseName = process.env.POSTGRES_DB;

  const databaseVersion = await database.query("SHOW server_version;")
  const databaseMaxConnections = await database.query("SHOW max_connections;")
  const databaseOpenedConnections = await database.query(
    {
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName]
    }
  )

  const updatedAt = new Date().toISOString()
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        opened_connections: databaseOpenedConnections.rows[0].count,
        max_connections: parseInt(databaseMaxConnections.rows[0].max_connections)
      }
    }
  })
}

export default status