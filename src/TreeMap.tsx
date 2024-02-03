
import {forEach, size} from "lodash";
import {useMemo} from "react";

import D3TreeMap from "./D3TreeMap";

import {formatBytes, formatTime} from "./Util";


interface Props {
  aggregate: Aggregate;
  data: ModuleData;
}

export default function TreeMap({aggregate, data}: Props) {
  const modulesList = aggregate === "time" ? data.modulesByTime : data.modulesByAlloc;
  const numModules = size(modulesList);

  console.log("modulesList", modulesList);

  const nestedData = useMemo(() => {
    const ret = {
      title: "Top-level",
      value: 0,
      children: {},
    };

    for (const module of modulesList) {
      let current = ret;
      let soFar = "";
      const parts = module.module.split(".");
      for (let i = 0; i < parts.length; i += 1) {
        const part = parts[i];
        soFar += (i === 0 ? part : "." + part);
        current.children[part] = current.children[part] || {
          title: soFar,
          value: 0,
          children: {}
        }
        current = current.children[part];
        current.value += (aggregate === "time" ? module["time"]: module["alloc"]);
      }
    }
    forEach(ret.children, (x) => {
      ret.value += x.value;
    });

    console.log("Built nestedData", ret);

    return ret;
  }, [modulesList]);

  const myData: Tree<TreeNode> = {
    "name": "analytics",
    "color": "#12939A",
    "size": 48716,
    "children": [
      {
        "name": "cluster",
        "color": "#12939A",
        "size": 15207,
        "children": [
          {"name": "AgglomerativeCluster", "color": "#12939A", "size": 3938},
          {"name": "CommunityStructure", "color": "#12939A", "size": 3812},
          {"name": "HierarchicalCluster", "color": "#12939A", "size": 6714},
          {"name": "MergeEdge", "color": "#12939A", "size": 743}
        ]
      },
      {
        "name": "graph",
        "color": "#12939A",
        "size": 26435,
        "children": [
          {"name": "BetweennessCentrality", "color": "#12939A", "size": 3534},
          {"name": "LinkDistance", "color": "#12939A", "size": 5731},
          {"name": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
          {"name": "ShortestPaths", "color": "#12939A", "size": 5914},
          {"name": "SpanningTree", "color": "#12939A", "size": 3416}
        ]
      },
      {
        "name": "optimization",
        "color": "#12939A",
        "size": 7074,
        "children": [
          {"name": "AspectRatioBanker", "color": "#12939A", "size": 7074}
        ]
      }
    ]
  };

  // Modes: squarify, resquarify, slice, dice, slicedice, binary, circlePack, partition, partition-pivot

  return (
    <D3TreeMap
      width={500}
      height={500}
      data={myData}
      labelFn={(x) => {
        return x.name;
      }}
      subLabelFn={(x) => {
        return aggregate === "time" ? formatTime(x.size) : formatBytes(size);
      }}
      valueFn={(x) => {
        return x.size;
      }}
    />
  );
}
