
import {size} from "lodash";
import {Treemap as RVTreeMap} from "react-vis";

import "react-vis/dist/style.css";

// import {formatBytes, formatTime} from "./Util";


interface Props {
  aggregate: Aggregate;
  data: ModuleData;
}

export default function TreeMap({aggregate, data}: Props) {
  const modulesList = aggregate === "time" ? data.modulesByTime : data.modulesByAlloc;
  const numModules = size(modulesList);

  console.log("modulesList", modulesList);

  const myData = {
    "title": "analytics",
    "color": "#12939A",
    "children": [
      {
        "title": "cluster",
        "children": [
          {"title": "AgglomerativeCluster", "color": "#12939A", "size": 3938},
          {"title": "CommunityStructure", "color": "#12939A", "size": 3812},
          {"title": "HierarchicalCluster", "color": "#12939A", "size": 6714},
          {"title": "MergeEdge", "color": "#12939A", "size": 743}
        ]
      },
      {
        "title": "graph",
        "children": [
          {"title": "BetweennessCentrality", "color": "#12939A", "size": 3534},
          {"title": "LinkDistance", "color": "#12939A", "size": 5731},
          {"title": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
          {"title": "ShortestPaths", "color": "#12939A", "size": 5914},
          {"title": "SpanningTree", "color": "#12939A", "size": 3416}
        ]
      },
      {
        "title": "optimization",
        "children": [
          {"title": "AspectRatioBanker", "color": "#12939A", "size": 7074}
        ]
      }
    ]
  }

  // Modes: squarify, resquarify, slice, dice, slicedice, binary, circlePack, partition, partition-pivot

  return (
    <RVTreeMap
      title={'My New Treemap'}
      width={300}
      height={300}
      data={myData}
      mode="binary"
    />
  );
}
