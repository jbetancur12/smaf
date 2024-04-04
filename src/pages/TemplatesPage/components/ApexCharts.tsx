import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import "./LineChart.css";

interface SeriesData {
  name: string;
  data: number[];
}

const LineChart: React.FC<{ data: any[]; multiAxis: boolean }> = ({
  data,
  multiAxis,
}) => {
  // Extrae las categorías de tiempo y los valores de cada métrica

  const categories = data.map((entry) =>
    new Date(entry.timestamp).toLocaleString()
  );

  const metricNames = Object.keys(data[0].measurements);

  const seriesData: SeriesData[] = metricNames.map((metricName) => ({
    name: metricName,
    data: data.map((entry) => entry.measurements[metricName]),
  }));

  const series: ApexAxisChartSeries = seriesData.map((seriesItem) => ({
    name: seriesItem.name,
    data: seriesItem.data.map((value, index) => ({
      x: index, // Utiliza el índice como valor "x" (puedes personalizar esto según tus necesidades)
      y: value, // Usa el valor de los datos como valor "y"
      marker: {
        enabled:
          isValidNumber(value) &&
          (value === Math.max(...seriesItem.data.filter(isValidNumber)) ||
            value === Math.min(...seriesItem.data.filter(isValidNumber))),
        size: 8,
        fillColor: "#FF0000",
      },
    })),
  }));

  const yAxesConfig1 = series.map((series, index) => ({
    // opposite: true,
    seriesName: series.name,
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: getRandomColor(index), // Genera un color aleatorio para el eje
    },
    labels: {
      style: {
        colors: getRandomColor(index), // Genera un color aleatorio para las etiquetas
      },
      formatter: function (value: number) {
        if (value % 1 === 0) {
          return value.toString(); // Muestra números enteros sin decimales
        }
        return value.toFixed(2); // Muestra dos decimales para otros valores
      },
    },
    title: {
      text: series.name,
      style: {
        color: getRandomColor(index), // Genera un color aleatorio para el título
      },
    },
  }));

  const yAxesConfig2 = {
    // opposite: true,
    // seriesName: series.name,
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      // color: "green", // Genera un color aleatorio para el eje
    },
    labels: {
      style: {
        colors: "green", // Genera un color aleatorio para las etiquetas
      },
      formatter: function (value: number) {
        if (value % 1 === 0) {
          return value.toString(); // Muestra números enteros sin decimales
        }
        return value.toFixed(2); // Muestra dos decimales para otros valores
      },
    },
    title: {
      // text: series.name,
      style: {
        // color: getRandomColor(index), // Genera un color aleatorio para el título
      },
    },
  };

  const options: ApexOptions = {
    // annotations: {
    //   points: maxMinAnnotations
    // },
    chart: {
      id: "multi-axis-line-chart",
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
        export: {
          csv: {
            dateFormatter(timestamp) {
              // Formatear la fecha utilizando toLocaleString()
              return timestamp;
            },
          },
        },
      },
    },
    xaxis: {
      categories: categories,
      tickAmount: 10,
    },
    yaxis: multiAxis ? yAxesConfig1 : yAxesConfig2,
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
      width: 2,
      dashArray: 0,
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

function getRandomColor(index: number): string {
  // Implementa tu lógica para asignar un color específico a cada eje
  // Por ejemplo, puedes mantener una lista de colores y asignar uno basado en el índice.
  const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"];
  return colors[index % colors.length];
}

// function getRandomColor(): string {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }

//   return color;
// }

function isValidNumber(value: any): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

export default LineChart;
