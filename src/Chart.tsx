
import * as React from "react";

import ReactApexCharts from "react-apexcharts";

interface Props {
  series: Array<{name: string; data: number[];}>;
  categories: Array<string | number>;
};

export default class ApexChart extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.state = {
      series: props.series,

      options: {
        chart: {
          type: 'bar',
          height: 16 * props.categories.length,
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
          text: 'Build report by time'
        },
        xaxis: {
          categories: props.categories,
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
      },
    };
  }

  render() {
    return (
      <div id="chart">
          <ReactApexCharts options={this.state.options}
                           series={this.state.series}
                           type="bar"
                           height={16 * this.props.categories.length} />
      </div>
    );
  }
}
