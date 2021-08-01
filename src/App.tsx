
import {reduce} from "lodash";
import * as React from "react";

import "tachyons";

import Chart from "./Chart";


interface Event {
  module: string;
  phase: string;
  time: number;
  alloc: number;
};

interface ModuleData {
  phasesByAlloc: Array<{phase: string, alloc: number}>;
  phasesByTime: Array<{phase: string, time: number}>;
  data: Array<Event>;
}

// Inserted by the Node server
// @ts-ignore
const data: ModuleData = window.module_data;

export default function App() {
  const totalTime = React.useMemo(() =>
    reduce(data.phasesByTime, (result, value) => result + value.time, 0)
  , [data]);

  console.log("Got data", data);

  return (
    <div className="center w-80">
        <div>
            Total time: {totalTime}
        </div>

        <Chart />
    </div>
  );
}
