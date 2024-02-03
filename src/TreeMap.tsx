
import {useMemo} from "react";

import buildNestedData from "./TreeMap/BuildData";
import {formatBytes, formatTime} from "./Util";

// import D3TreeMap from "./D3TreeMap";

import D3TreeMap from "react-d3-treemap";
import "react-d3-treemap/dist/react.d3.treemap.css";

interface Props {
  aggregate: Aggregate;
  data: ModuleData;
}

export default function TreeMap({aggregate, data}: Props) {
  const modulesList = aggregate === "time" ? data.modulesByTime : data.modulesByAlloc;
  console.log("modulesList", modulesList);

  const nestedData: Tree<TreeNode> = useMemo(() => buildNestedData(aggregate, modulesList), [aggregate, modulesList]);

  // Modes: squarify, resquarify, slice, dice, slicedice, binary, circlePack, partition, partition-pivot

  return (
    <D3TreeMap<Tree<TreeNode>>
      id="myTreeMap"
      width={500}
      height={400}
      data={nestedData}
      valueUnit={aggregate === "time" ? "us" : "B"}
      levelsToDisplay={2}
      />
  );

  // return (
  //   <D3TreeMap
  //     width={500}
  //     height={500}
  //     data={nestedData}
  //     labelFn={(x) => x.name}
  //     subLabelFn={(x) => aggregate === "time" ? formatTime(x.value) : formatBytes(x.value)}
  //     valueFn={(x) => x.value}
  //   />
  // );
}
