
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {map, reduce, size} from "lodash";
import * as React from "react";

import Chart from "./Chart";
import {formatBytes, formatTime} from "./Util";


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

// @ts-ignore, inserted into the HTML
const data: ModuleData = window.module_data;

type Visualization = "bars" | "treemap";
type Aggregate = "time" | "alloc";

export default function App() {
  const [visualization, setVisualization] = React.useState<Visualization>("bars");
  const [aggregate, setAggregate] = React.useState<Aggregate>("time");
  const [numModulesToShow, setNumModulesToShow] = React.useState(50);

  const totalTime = React.useMemo(() => reduce(data.phasesByTime, (n, value) => n + value.time, 0), [data]);
  const totalAlloc = React.useMemo(() => reduce(data.phasesByAlloc, (n, value) => n + value.alloc, 0), [data]);

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
  }, [modulesList]);

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

    console.log("Made series", ret);

    return ret;
  }, [phasesList, moduleToIndex, aggregate]);

  const [finalSeries, finalModuleNames] = React.useMemo(() => {
    const finalSeries = map(series, (x) => ({
      name: x.name,
      data: x.data.slice(0, numModulesToShow)
    }));

    const finalModuleNames = moduleNames.slice(0, numModulesToShow);

    console.log("Made finalSeries", finalSeries);
    console.log("Made finalModuleNames", finalModuleNames);

    return [finalSeries, finalModuleNames];
  }, [series, moduleNames, numModulesToShow]);

  const handleSetVisualization = React.useCallback((event) => setVisualization(event.target.value), [setVisualization]);
  const handleSetAggregate = React.useCallback((event) => setAggregate(event.target.value), [setAggregate]);
  const handleSetNumModulesToShow = React.useCallback((event) => setNumModulesToShow(event.target.value), [setNumModulesToShow]);

  return (
    <div className="center w-80">
        <div className="ba b--silver pa1 mv1 flex flex-row justify-between">
            <div>
                <Select value={visualization}
                        onChange={handleSetVisualization}>
                    <MenuItem value="bars">Bar chart</MenuItem>
                    <MenuItem value="treemap">Treemap</MenuItem>
                </Select>

                <Select className="ml2"
                        value={aggregate}
                        onChange={handleSetAggregate}>
                    <MenuItem value="time">Time (ms)</MenuItem>
                    <MenuItem value="alloc">Allocations (bytes)</MenuItem>
                </Select>

                {visualization === "bars" &&
                 <Select className="ml2"
                         value={numModulesToShow}
                         onChange={handleSetNumModulesToShow}>
                     <MenuItem value={10}>Top 10 modules</MenuItem>
                     <MenuItem value={20}>Top 20 modules</MenuItem>
                     <MenuItem value={50}>Top 50 modules</MenuItem>
                     <MenuItem value={100}>Top 100 modules</MenuItem>
                     <MenuItem value={Infinity}>All modules</MenuItem>
                 </Select>
                }
            </div>

            <div className="dib">
                <div className="dib mr2">
                    <div className="gray">Total time</div>
                    <div className="gray">Total allocations</div>
                </div>

                <div className="dib near-black">
                    <div className="code">{formatTime(totalTime)}</div>
                    <div className="code">{formatBytes(totalAlloc)}</div>
                </div>
            </div>
        </div>

        <Chart title={"Build report by " + aggregate}
               series={finalSeries}
               categories={finalModuleNames}
               xLabel={aggregate === "time" ? "Time" : "Allocations"}
               formatter={aggregate === "time" ? formatTime : formatBytes} />
    </div>
  );
}
