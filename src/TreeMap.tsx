
import { debounce } from "lodash";
import { CSSProperties, useEffect, useMemo, useRef, useState} from "react";

import CleanTreeMap from "./CleanTreeMap";

import buildNestedData, {removeEmptyNodes} from "./TreeMap/BuildData";
import {formatBytes, formatTime} from "./Util";


interface Props {
  aggregate: Aggregate;
  data: ModuleData;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  height: "80vh",
};

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
         <CleanTreeMap
           width={dimensions.width}
           height={dimensions.height}
           data={nestedData}
           labelFn={(x) => x.name}
           subLabelFn={(d, value) => aggregate === "time" ? formatTime(value) : formatBytes(value)}
           valueFn={(x) => x.value}
         />
        }
    </div>
  );
}
