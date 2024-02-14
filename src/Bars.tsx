
import {map, size} from "lodash";
import {useMemo} from "react";

import Chart from "./Bars/Chart";
import {formatBytes, formatTime} from "./Formatting";


interface Props {
  aggregate: Aggregate;
  data: ModuleData;
  numModulesToShow: number;
}

export default function Bars({aggregate, data, numModulesToShow}: Props) {
  const modulesList = aggregate === "time" ? data.modulesByTime : data.modulesByAlloc;
  const phasesList = aggregate === "time" ? data.phasesByTime : data.phasesByAlloc;
  const numModules = size(modulesList);

  const [moduleToIndex, moduleNames] = useMemo(() => {
    const ret = {};
    const names = [];
    let counter = 0;
    for (let module of modulesList) {
      ret[module.module] = counter++;
      names.push(module.module);
    }
    return [ret, names]
  }, [modulesList]);

  const series = useMemo(() => {
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

  const [finalSeries, finalModuleNames] = useMemo(() => {
    const finalSeries = map(series, (x) => ({
      name: x.name,
      data: x.data.slice(0, numModulesToShow)
    }));

    const finalModuleNames = moduleNames.slice(0, numModulesToShow);

    console.log("Made finalSeries", finalSeries);
    console.log("Made finalModuleNames", finalModuleNames);

    return [finalSeries, finalModuleNames];
  }, [series, moduleNames, numModulesToShow]);

  return (
    <Chart title={"Build report by " + aggregate}
           series={finalSeries}
           categories={finalModuleNames}
           xLabel={aggregate === "time" ? "Time" : "Allocations"}
           formatter={aggregate === "time" ? formatTime : formatBytes} />
  );
}
