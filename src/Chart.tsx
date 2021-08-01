
import * as React from "react";

import ReactApexCharts from "react-apexcharts";

interface Props {
  title: string;
  series: Array<{name: string; data: number[];}>;
  categories: Array<string | number>;
};

const baseHeight = 200;

export default function ApexChart({title, series, categories}) {
  const options = React.useMemo(() => ({
    chart: {
      animations: {
        enabled: false
      },
      type: 'bar',
      /*           height: baseHeight + (16 * categories.length), */
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    title: {
      text: title
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: function (val) {
          return val + "K"
        }
      }
    },
    yaxis: {
      title: {
        text: "Time"
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K"
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
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
