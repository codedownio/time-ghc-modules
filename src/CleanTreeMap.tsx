import { type TreemapLayout, hierarchy, treemap, treemapBinary } from "d3-hierarchy";
import { interpolateRgb } from "d3-interpolate";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { isEqual, keys } from "lodash";
import { PureComponent } from "react";


interface Props<D> {
  data: Tree<D>;

  width: number;
  height: number;

  labelFn: (d: D) => string;
  subLabelFn: (d: D) => string;
  valueFn: (d: D) => number;
}

export default function CleanTreeMap<D>({data, width, height, labelFn, subLabelFn, valueFn}: Props<D>) {

  return (
    <p>
        TODO
    </p>
  )
}
