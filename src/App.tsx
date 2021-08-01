
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
  modules: Array<{module: string;}>;
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

  const numModules = data.modules.length;

  const [moduleToIndex, moduleNames] = React.useMemo(() => {
    const ret = {};
    const names = [];
    let counter = 0;
    for (let module of data.modules) {
      ret[module.module] = counter++;
      names.push(module.module);
    }
    return [ret, names]
  }, [data]);

  const series = React.useMemo(() => {
    const ret = [];

    const phaseToIndex = {};
    let counter = 0;

    // Allocate empty vectors for every series
    for (let phase of data.phasesByTime) {
      const name = phase.phase;
      phaseToIndex[name] = counter++;
      ret.push({name, data: Array(numModules).fill(0)})
    }

    // Pass over all the data
    for (let event of data.data) {
      ret[phaseToIndex[event.phase]][moduleToIndex[event.module]] = event.time;
    }

    return ret;
  }, [data, moduleToIndex]);

  console.log("Made series", series);

  return (
    <div className="center w-80">
        <div>
            Total time: {totalTime}
        </div>

        <Chart series={series}
               categories={moduleNames} />
    </div>
  );
}
