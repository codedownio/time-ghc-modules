
import * as React from "react";

import ReactApexCharts from "react-apexcharts";

interface Props {
  title: string;
  series: Array<{name: string; data: number[];}>;
  categories: Array<string | number>;
  xLabel: string;
  formatter: (value: number | string) => string;
};

const baseHeight = 200;

export default function ApexChart({title, series, categories, xLabel, formatter}: Props) {
  const options: ApexCharts.ApexOptions = React.useMemo(() => ({
    chart: {
      animations: {
        enabled: false
      },
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"]
    },
    title: {
      text: title
    },
    xaxis: {
      title: {
        text: xLabel
      },
      categories: categories,
      labels: { formatter }
    },
    yaxis: {
      title: {
        text: "Module"
      },
      labels: {
        maxWidth: 320
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: { formatter }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40
    }
  }), [title, categories]);

  return (
    <div id="chart">
        <ReactApexCharts options={options}
                         series={series}
                         type="bar"
                         height={baseHeight + (16 * categories.length)} />
    </div>
  );
}
