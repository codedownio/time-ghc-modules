import { group } from "d3-array";
import { type HierarchyRectangularNode, hierarchy, treemap } from "d3-hierarchy";
import { scaleSequential } from "d3-scale";
import { interpolateMagma,  } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {uid} from "./Uid";


interface Props<D> {
  data: Tree<D>;

  width: number;
  height: number;

  labelFn: (d: D) => string;
  subLabelFn: (d: D, value: number) => string;
  valueFn: (d: D) => number;
}

const baseSvgStyle: CSSProperties = {
  maxWidth: "100%",
  height: "auto",
  overflow: "visible",
  font: "10px sans-serif",
};

interface IBreadcrumb {
  name: string;
  activate: () => void;
}

function makeBreadcrumb<D>(data: D, labelFn: (x: D) => string, setSelectedData: (x: Tree<D>) => void): IBreadcrumb {
  return {
    name: labelFn(data),
    activate: () => setSelectedData(data)
  };
}

export default function CleanTreeMap<D>({data, width, height, labelFn, subLabelFn, valueFn}: Props<D>) {
  const svgRef = useRef(null);
  const [selectedData, setSelectedData] = useState(data);
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumb[]>([makeBreadcrumb(data, labelFn, setSelectedData)]);

  useEffect(() => {
    setSelectedData(data);
    setBreadcrumbs([makeBreadcrumb(data, labelFn, setSelectedData)]);
  }, [data, labelFn, setSelectedData]);

  const breadcrumbsRef = useRef(breadcrumbs);
  breadcrumbsRef.current = breadcrumbs;

  const requestSetData = useCallback((d: HierarchyRectangularNode<D>) => {
    setSelectedData(d.data);

    const parents = d.ancestors().reverse();

    const bcs: IBreadcrumb[] = [...breadcrumbsRef.current.slice(0, breadcrumbsRef.current.length - 1)];
    for (let i = 0; i < parents.length; i += 1) {
      let dprime = parents[i];
      let bcsSoFar = [...bcs];
      const newBc = {
        name: labelFn(dprime.data),
        activate: () => {
          setSelectedData(dprime.data);
          setBreadcrumbs([...bcsSoFar, newBc]);
        }
      };
      bcs.push(newBc);
    }
    setBreadcrumbs(bcs);
  }, [setSelectedData])

  const [root, color] = useMemo(() => {
    const root = treemap<D>()
      .size([width, height])
      .paddingOuter(3)
      .paddingInner(3)
      .paddingTop(19)
      .round(true)
    (hierarchy(selectedData)
      .sum(valueFn)
      .sort((a, b) => b.value - a.value));

    const color = scaleSequential([8, 0], interpolateMagma)

    return [root, color]
  }, [width, height, selectedData, valueFn]);

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);

    console.log("Rendering svg", svg);

    const shadow = uid("shadow");

    svg.append("filter")
       .attr("id", shadow.id)
       .append("feDropShadow")
       .attr("flood-opacity", 0.3)
       .attr("dx", 0)
       .attr("stdDeviation", 3);

    const node = svg.selectAll("g")
                    .data(root)
                    .attr("filter", shadow)
                    .join("g")
                    .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
                    .style("cursor", (d) => d.children ? "pointer" : "default")
                    .style("font-weight", (d) => d.children ? "bold" : "auto")
                    .on("click", (_event, d) => d.children ? requestSetData(d) : null);

    node.append("title")
        .text(d => labelFn(d.data) + " / " + subLabelFn(d.data, d.value));

    node.append("rect")
        .attr("id", d => (d["nodeUid"] = d["nodeUid"] || uid("node")).id)
        .attr("fill", d => color(d.height))
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    node.append("clipPath")
        .attr("id", d => (d["clipUid"] = d["clipUid"] || uid("clip")).id)
        .append("use")
        .attr("xlink:href", d => d["nodeUid"].href);

    node.append("text")
        .attr("clip-path", d => d["clipUid"])
        .selectAll("tspan")
        .data(d => [
          labelFn(d.data) + (d.children ? (" (+" + (d.descendants().length - 1) + ")") : ""),
          subLabelFn(d.data, d.value)
        ])
        .join("tspan")
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);

    node.filter(d => d.children && d.children.length > 0).selectAll("tspan")
        .attr("dx", 3)
        .attr("y", 13);

    node.filter(d => !d.children || d.children.length === 0).selectAll("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [width, height, root]);

  return (
    <div>
        <div className="breadcrumbs mv1 pv1">
            {breadcrumbs.map((bc, i) =>
              <>
                  <span className="b pointer"
                        key={bc.name}
                        onClick={bc.activate}>{bc.name}</span>

                  {(i < breadcrumbs.length - 1) &&
                   <span className="mh2"
                         key="slash">/</span>
                  }
              </>
            )}
        </div>

        <svg width={width}
             height={height}
             viewBox={`0 0 ${width} ${height}`}
             ref={svgRef}
             style={baseSvgStyle}>
        </svg>
    </div>
  );
}
