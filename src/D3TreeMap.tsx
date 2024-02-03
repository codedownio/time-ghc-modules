import { type TreemapLayout, hierarchy, treemap, treemapBinary } from "d3-hierarchy";
import { interpolateRgb } from "d3-interpolate";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { isEqual, keys } from "lodash";
import { PureComponent } from "react";


interface ITreeMapProps<D> {
  data: Tree<D>;

  width: number;
  height: number;

  labelFn: (d: D) => string;
  subLabelFn: (d: D) => string;
  valueFn: (d: D) => number;
}

interface ITreeMapState<D> {
  cell: any;
  treemap: TreemapLayout<D>;
}

export default class TreeMap<D> extends PureComponent<ITreeMapProps<D>, ITreeMapState<D>> {
  svg: SVGSVGElement;

  constructor(props: ITreeMapProps<D>) {
    super(props);

    this.state = {
      cell: null,
      treemap: null,
    };
  }

  componentDidMount() {
    const width = this.props.width;
    const height = this.props.height;

    select(this.svg)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${Math.min(width, height)} ${Math.min(width, height)}`)
      .attr("preserveAspectRatio", "xMinYMin");

    const tm = treemap<D>()
      .tile(treemapBinary) // treemapSquarify, treemapSliceDice, treemapSlice, treemapDice
      .size([width, height])
      .round(true)
      .paddingInner(1);

    this.setState({ ...this.state, treemap: tm });

    this.refresh(this.svg, tm);
  }

  componentDidUpdate(prevProps: ITreeMapProps<D>, _prevState: ITreeMapState<D>) {
    if (prevProps.data !== this.props.data) {
      this.refresh(this.svg, this.state.treemap, isEqual(keys(prevProps.data), keys(this.props.data)));
    }
  }

  refresh(svg: SVGSVGElement, treemap: TreemapLayout<D>, sameNodes = true) {
    if (!this.state.cell || !sameNodes) {
      select(svg).selectAll("*").remove();
      const cell = this.drawData(svg, treemap, this.props.data);
      this.setState({ ...this.state, cell });
    } else {
      const root = hierarchy(this.props.data)
        .eachBefore((d) => (d.data.id = (d.parent ? d.parent.name + "." : "") + d.name))
        .sum((d) => this.props.valueFn(d))
        .sort((a, b) => b.height - a.height || b.value - a.value);

      treemap(root);

      this.state.cell.data(root.leaves());

      this.state.cell
        .transition()
        .duration(750)
        .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")")
        .select("rect")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);
    }
  }

  drawData(svg: SVGSVGElement, treemap: TreemapLayout<D>, data: Tree<D>) {
    const fader = (color) => interpolateRgb(color, "#fff")(0.2);
    const color = scaleOrdinal(schemeCategory10.map(fader));

    const root = hierarchy(data)
      .eachBefore((d) => (d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name))
      .sum((d) => this.props.valueFn(d))
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    const cell = select(svg)
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d: any) => "translate(" + d.x0 + "," + d.y0 + ")");

    // Add labels
    cell
      .append("rect")
      .attr("id", (d) => d.data.id)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("fill", (d) => color(this.props.labelFn(d.data)));

    // Add clip paths to ensure text doesn't overflow
    cell
      .append("clipPath")
      .attr("id", (d) => "clip-" + d.data.id)
      .append("use")
      .attr("xlink:href", (d) => "#" + d.data.id);

    // Append multiline text. The last line shows the value and has a specific formatting.
    cell
      .append("text")
      .attr("clip-path", (d) => "url(#clip-" + d.data.id + ")")
      .filter((d) => {
        console.log("d: ", d);
        return true;
      })
      .selectAll("tspan")
      .data((d) => [this.props.labelFn(d.data) + " | " + this.props.subLabelFn(d.data)])
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 10 + i * 10)
      .text((d: string) => d)
      .style("font-size", "8px");

    cell.append("title")
      .text((d) => this.props.labelFn(d.data) + ` (${this.props.subLabelFn(d.data)})`);

    return cell;
  }

  render() {
    return (
      <div className="tree-map">
        <svg ref={(c) => (this.svg = c)}></svg>
      </div>
    );
  }
}
