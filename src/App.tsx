
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {reduce} from "lodash";
import * as React from "react";

import {formatBytes, formatTime} from "./Formatting";

import Bars from "./Bars";
import TreeMap from "./TreeMap";


// @ts-ignore, inserted into the HTML
const data: ModuleData = window.module_data;

export default function App() {
  const [visualization, setVisualization] = React.useState<Visualization>("bars");
  const [aggregate, setAggregate] = React.useState<Aggregate>("time");
  const [numModulesToShow, setNumModulesToShow] = React.useState(50);

  const totalTime = React.useMemo(() => reduce(data.phasesByTime, (n, value) => n + value.time, 0), [data]);
  const totalAlloc = React.useMemo(() => reduce(data.phasesByAlloc, (n, value) => n + value.alloc, 0), [data]);

  console.log("Got data", data);

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

        {visualization === "bars" &&
         <Bars aggregate={aggregate}
               data={data}
               numModulesToShow={numModulesToShow} />
        }

        {visualization === "treemap" &&
         <TreeMap aggregate={aggregate}
                  data={data} />
        }
    </div>
  );
}
