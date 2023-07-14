const express = require("express");
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "db",
  database: "names_db",
  user: "root",
  password: "root",
});

const app = express();
const port = 3000;

// INSERE DADOS NO DB CASO NÃO EXISTAM
(async () => {
  await conn.promise().query(`
  CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id));
  `);
  const [rows] = await conn.promise().query("SELECT * FROM people");
  const isEmpty = rows.length === 0;
  if (isEmpty) {
    await conn.promise().query(`INSERT INTO people (name) VALUES ('João'), ('Maria'), ('Antônio');`);
  }
})();

app.get("/", async (_req, res) => {
  const title = `<h1>Full Cycle rocks!</h1>`;
  const names = await conn.promise().query("SELECT * FROM people");
  const namesList = names[0].map(({ name }) => `<li>${name}</li>`);
  const body = `<ul>${namesList.join(",").replaceAll(",", "")}</ul>`;
  return res.send(title + body);
});

app.listen(port, async () => {
  console.log(`Server listeining on port ${port}...`);
});
