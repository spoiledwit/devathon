import React from "react";
import ReactApexChart from "react-apexcharts";
import useChartColors from "./useChartColors";

const PerspectiveChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  const series = [
    {
      data: [
        {
          x: "React",
          y: 218,
        },
        {
          x: "TailwindCSS",
          y: 187,
        },
        {
          x: "Angular",
          y: 134,
        },
        {
          x: "Vue Js",
          y: 55,
        },
        {
          x: "Laravel",
          y: 99,
        },
        {
          x: "PHP",
          y: 34,
        },
        {
          x: "ASP.Net",
          y: 86,
        },
        {
          x: "Django",
          y: 30,
        },
        {
          x: "CI",
          y: 44,
        },
      ],
    },
  ];
  var options: any = {
    legend: {
      show: false,
    },
    chart: {
      height: 270,
      type: "treemap",
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -15,
        bottom: 0,
        right: -20,
      },
    },
    colors: chartColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-custom-500"]'
        id="platformPerspective"
        className="apex-charts"
        type="treemap"
        height={270}
      />
    </React.Fragment>
  );
};

const UserGrowthChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  const series = [
    {
      name: "Total Users",
      data: [1000, 1500, 2200, 3100, 4300, 5800, 7500, 9400, 11500],
    },
  ];
  var options: any = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      width: 2,
      dashArray: 0,
    },
    dataLabels: {
      enabled: false,
    },
    colors: chartColors,
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    yaxis: {
      title: {
        text: "Number of Users",
      },
      labels: {
        formatter: function (value: any) {
          return value.toFixed(0);
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value: any) {
          return value + " users";
        },
      },
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-blue-500"]'
        id="userGrowth"
        className="apex-charts"
        type="line"
        height={350}
      />
    </React.Fragment>
  );
};

const InteractionChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  const series = [
    {
      name: "Viewers",
      data: [20, 13, 19, 23, 29, 42, 33, 29, 37, 46, 40, 49],
    },
    // {
    //     name: 'Followers',
    //     data: [10, 18, 13, 23, 33, 39, 30, 21, 36, 42, 39, 46]
    // }
  ];

  var options: any = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: -10,
      },
    },
    colors: chartColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-custom-500", "bg-purple-500"]'
        id="pagesInteraction"
        className="apex-charts"
        type="bar"
        height={350}
      />
    </React.Fragment>
  );
};

const UserDeviceChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  //User Devices
  const series = [
    {
      name: "Desktop",
      data: [80, 50, 30, 40, 100, 20],
    },
    {
      name: "Mobile",
      data: [20, 30, 40, 80, 20, 80],
    },
    {
      name: "Others",
      data: [44, 76, 78, 13, 43, 10],
    },
  ];
  var options: any = {
    chart: {
      height: 240,
      type: "radar",
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
    colors: chartColors,
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
    xaxis: {
      categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-custom-500", "bg-green-500", "bg-orange-500"]'
        id="userDeviceCharts"
        className="apex-charts"
        type="radar"
        height={240}
      />
    </React.Fragment>
  );
};

const SatisfactionChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  //Satisfaction Rate
  const series = [95.33];
  var options: any = {
    chart: {
      type: "radialBar",
      height: 450,
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
        },
        hollow: {
          size: "60%",
          margin: 0,
          imageWidth: 36,
          imageHeight: 36,
          imageClipped: false,
          imageOffsetY: -60,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -5,
            fontSize: "22px",
            fontWeight: "600",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    colors: chartColors,
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ["Average Results"],
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-custom-500"]'
        id="satisfactionRate"
        className="apex-charts"
        type="radialBar"
        height={450}
      />
    </React.Fragment>
  );
};

const CustomersChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  // New vs Returning Customers
  const series = [
    {
      name: "New Customers",
      data: [30, 40, 35, 50, 49, 60, 70, 91],
    },
    {
      name: "Returning Customers",
      data: [45, 52, 38, 24, 33, 26, 21, 20],
    },
  ];
  var options: any = {
    annotations: {
      points: [
        {
          x: "Bananas",
          seriesIndex: 0,
          label: {
            offsetY: 0,
            style: {
              color: "#fff",
            },
            text: "Bananas are good",
          },
        },
      ],
    },
    colors: chartColors,
    chart: {
      height: 238,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      tickPlacement: "on",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: -10,
        right: -10,
        left: -10,
      },
    },
    yaxis: {
      title: {
        text: "Number of Customers",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        formatter: function (value: any) {
          return value.toFixed(0);
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + " customers";
        },
      },
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-blue-500", "bg-green-500"]'
        id="customerInsightsChart"
        className="apex-charts"
        type="bar"
        height={238}
      />
    </React.Fragment>
  );
};

const ReportChart = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);
  // Line with Data Labels
  const series = [
    {
      name: "Income - 2023",
      data: [28, 29, 33, 36, 32],
    },
    {
      name: "Expense - 2023",
      data: [20, 17, 21, 29, 23],
    },
  ];
  var options: any = {
    chart: {
      height: 235,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
    },
    colors: chartColors,
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
      size: 2,
    },
    markers: {
      size: 1,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: ["Mar", "Apr", "May", "Jun", "Jul"],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: -25,
      },
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        data-chart-colors='["bg-custom-500", "bg-green-500"]'
        id="lineWithDataLabel"
        className="apex-charts"
        type="line"
        height={235}
      />
    </React.Fragment>
  );
};

const GarageBreakdownChart = ({
  chartId,
  activeTab,
}: {
  chartId: string;
  activeTab: string;
}) => {
  const chartColors = useChartColors(chartId);

  const data = {
    vehicleType: {
      series: [40, 30, 20, 10],
      labels: ["Sedans", "SUVs", "Trucks", "Other"],
    },
    serviceType: {
      series: [45, 35, 15, 5],
      labels: ["Maintenance", "Repairs", "Upgrades", "Other"],
    },
  };

  //@ts-ignore
  const { series, labels } = data[activeTab];

  const options = {
    labels: labels,
    chart: {
      height: 300,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label:
                activeTab === "vehicleType"
                  ? "Total Vehicles"
                  : "Total Services",
              formatter: function (w:any) {
                return w.globals.seriesTotals
                  .reduce((a: any, b: any) => a + b, 0)
                  .toString();
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    colors: chartColors,
    legend: {
      position: "bottom",
      formatter: function (val:any, opts:any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex] + "%";
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={300}
      data-chart-colors={`["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]`}
      id={`garageBreakdown-${activeTab}`}
      className="apex-charts"
    />
  );
};

export {
  PerspectiveChart,
  UserGrowthChart,
  InteractionChart,
  UserDeviceChart,
  SatisfactionChart,
  CustomersChart,
  ReportChart,
  GarageBreakdownChart,
};
