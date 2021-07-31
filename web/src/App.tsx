
import React, { useState, useEffect } from "react";
import "./styles.css";

import Chart from "./Chart";


// @ts-ignore
import initSqlJs from "sql.js";

// Required to let webpack 4 know it needs to copy the wasm file to our assets
// @ts-ignore
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default function App() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
    // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
    // see ../craco.config.js
    initSqlJs({ locateFile: () => sqlWasm })
      .then((SQL: any) => setDb(new SQL.Database(SQL)))
      .catch((err: any) => setError(err));
  }, []);

  if (error) return <pre>{error}</pre>;
  else if (!db) return <pre>Loading...</pre>;
  else return (
    <div>
      <h1>HIIIIII</h1>
      <Chart />
    </div>
  );
}
