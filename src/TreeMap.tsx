
import {useMemo} from "react";

import D3TreeMap from "./D3TreeMap";
import buildNestedData from "./TreeMap/BuildData";
import {formatBytes, formatTime} from "./Util";


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
    <D3TreeMap
      width={500}
      height={500}
      data={nestedData}
      labelFn={(x) => x.name}
      subLabelFn={(x) => aggregate === "time" ? formatTime(x.size) : formatBytes(x.size)}
      valueFn={(x) => x.size}
    />
  );
}
