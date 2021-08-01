
import {reduce, size} from "lodash";
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
  modulesByAlloc: Array<{module: string, alloc: number}>;
  modulesByTime: Array<{module: string, time: number}>;
  modules: Array<{module: string;}>;
  data: Array<Event>;
}

// Inserted by the Node server
// @ts-ignore
const data: ModuleData = window.module_data;

type Aggregate = "time" | "alloc";

export default function App() {
  const [aggregate, setAggregate] = React.useState<Aggregate>("time");

  const totalTime = React.useMemo(() =>
    reduce(data.phasesByTime, (result, value) => result + value.time, 0)
  , [data]);

  console.log("Got data", data);

  const modulesList = aggregate === "time" ? data.modulesByTime : data.modulesByAlloc;
  const phasesList = aggregate === "time" ? data.phasesByTime : data.phasesByAlloc;
  const numModules = size(modulesList);

  const [moduleToIndex, moduleNames] = React.useMemo(() => {
    const ret = {};
    const names = [];
    let counter = 0;
    for (let module of modulesList) {
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
    for (let phase of phasesList) {
      const name = phase.phase;
      phaseToIndex[name] = counter++;
      ret.push({name, data: Array(numModules).fill(0)})
    }

    // Pass over all the data
    for (let event of data.data) {
      ret[phaseToIndex[event.phase]].data[moduleToIndex[event.module]] = event[aggregate];
    }

    return ret;
  }, [data, moduleToIndex]);

  console.log("Made series", series);

  /* const [finalSeries, finalModuleNames] = React.useMemo(() => {
   *   const numModules = 200;

   *   const finalSeries = map(series, (x) => ({
   *     name: x.name,
   *     data: x.data.slice(0, numModules)
   *   }));

   *   return [finalSeries, moduleNames.slice(0, numModules)];
   * }, [series, moduleNames]); */

  return (
    <div className="center w-80">
        <div>
            <div>
                Total time: {totalTime}
            </div>

            <div>

            </div>
        </div>

        <Chart series={series}
               categories={moduleNames} />
    </div>
  );
}
