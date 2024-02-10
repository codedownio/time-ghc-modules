
import { scaleSequential } from "d3-scale";
import * as chromatic from "d3-scale-chromatic";
import { debounce } from "lodash";
import { CSSProperties, useEffect, useMemo, useRef, useState} from "react";

import buildNestedData, {removeEmptyNodes} from "./TreeMap/BuildData";
import {formatBytes, formatTime} from "./Util";

// import SimpleD3TreeMap from "./D3TreeMap";

import D3TreeMap, { ColorModel, NumberOfChildrenPlacement } from "@codedown/react-d3-treemap";


interface Props {
  aggregate: Aggregate;
  data: ModuleData;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  height: "80vh",
};

const paddingPx = 8;

const svgStyle: CSSProperties = {
  marginLeft: "-" + paddingPx + "px",
}

export default function TreeMap({aggregate, data}: Props) {
  const modulesList = aggregate === "time" ? data.modulesByTime : data.modulesByAlloc;

  const nestedData: Tree<TreeNode> = useMemo(() => {
    const tree = buildNestedData(aggregate, modulesList);
    return removeEmptyNodes(tree);
  }, [aggregate, modulesList]);

  const ref = useRef(null);
  const [dimensions, setDimensions] = useState<{ height: number, width: number } | null>(null);
  const elementObserver = useMemo(() => {
    return new ResizeObserver(() => {
      debounce(() => {
        if (!ref.current) return;
        setDimensions({
          height: ref.current.clientHeight,
          width: ref.current.clientWidth
        });
      }, 10)();
    });
  }, [ref.current]);
  useEffect(() => {
    if (!ref) return;
    const element = ref.current;

    elementObserver.observe(element);
    return () => {
      elementObserver.unobserve(element);
    };
  }, [ref.current, elementObserver]);

  return (
    <div ref={ref}
         style={wrapperStyle}>

      {dimensions &&
       <D3TreeMap<Tree<TreeNode>>
         key={aggregate}
         id="myTreeMap"
         width={dimensions.width + paddingPx}
         svgStyle={svgStyle}
         height={dimensions.height}
         data={nestedData}
         valueUnit=""
         levelsToDisplay={2}
         paddingInner={paddingPx}
         nodeClassName="AppTreeMap__node"
         nodeStyle={{
           fontSize: 12,
           paddingTop: 2,
           paddingLeft: 5,
           paddingRight: 5,
         }}
         numberOfChildrenPlacement={NumberOfChildrenPlacement.TopRight}
         customD3ColorScale={scaleSequential(
           chromatic.interpolateSpectral
         )}
         colorModel={ColorModel.OneEachChildren}
         darkNodeBorderColor="silver"
         darkNodeTextColor="white"
         lightNodeBorderColor="brown"
         lightNodeTextColor="brown"
         valueFn={aggregate === "time" ? formatTime : formatBytes}
         />
      }
    </div>
  );

  // return (
  //   <SimpleD3TreeMap
  //     width={500}
  //     height={500}
  //     data={nestedData}
  //     labelFn={(x) => x.name}
  //     subLabelFn={(x) => aggregate === "time" ? formatTime(x.value) : formatBytes(x.value)}
  //     valueFn={(x) => x.value}
  //   />
  // );
}
