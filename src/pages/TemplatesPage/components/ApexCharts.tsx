import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface SeriesData {
  name: string;
  data: number[];
}

const LineChart: React.FC<{ data: any[] }> = ({ data }) => {
  // Extrae las categorías de tiempo y los valores de cada métrica
  const categories = data.map((entry) => new Date(entry.timestamp).toLocaleString());

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
        enabled: isValidNumber(value) && (value === Math.max(...seriesItem.data.filter(isValidNumber)) || value === Math.min(...seriesItem.data.filter(isValidNumber))),
        size: 8,
        fillColor: '#FF0000',
      },
    })),
  }));


  // function findMaxMinPoints(seriesData: SeriesData[]) {
  //   const maxMinPoints: any[] = [];

  //   seriesData.forEach((series) => {
  //     const { data, name } = series;

  //     let maxPoint = { x: 0, y: -Infinity };
  //     let minPoint = { x: 0, y: Infinity };

  //     data.forEach((point, index) => {
  //       if (point > maxPoint.y) {
  //         maxPoint = { x: index, y: point };
  //       }
  //       if (point < minPoint.y) {
  //         minPoint = { x: index, y: point };
  //       }
  //     });

  //     // Agregar anotaciones de punto máximo y mínimo
  //     maxMinPoints.push({
  //       x: maxPoint.x,
  //       y: maxPoint.y,
  //       marker: {
  //         size: 3,
  //         fillColor: "#fff",
  //         strokeColor: "#2698FF",
  //         radius: 2
  //       },
  //       label: {
  //         borderColor: "#FF4560",
  //         offsetY: 0,
  //         style: {
  //           color: "#fff",
  //           background: "#FF4560"
  //         },
  //         text: maxPoint.y.toFixed(1)
  //       }
  //     });

  //     maxMinPoints.push({
  //       x: minPoint.x,
  //       y: minPoint.y,
  //       marker: {
  //         size: 3,
  //         fillColor: "#fff",
  //         strokeColor: "#2698FF",
  //         radius: 2
  //       },
  //       label: {
  //         borderColor: "#FF4560",
  //         offsetY: 0,
  //         style: {
  //           color: "#fff",
  //           background: "#FF4560"
  //         },
  //         text: minPoint.y.toFixed(1)
  //       }
  //     });
  //   });

  //   return maxMinPoints;
  // }

  // const maxMinAnnotations = findMaxMinPoints(seriesData);


  const yAxesConfig = series.map((series) => ({
    // opposite: true,
    seriesName: series.name,
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: getRandomColor(), // Genera un color aleatorio para el eje
    },
    labels: {
      style: {
        colors: getRandomColor(), // Genera un color aleatorio para las etiquetas
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
        color: getRandomColor(), // Genera un color aleatorio para el título
      },

    },
  }));

  const options: ApexOptions = {
    // annotations: {
    //   points: maxMinAnnotations
    // },
    chart: {
      id: 'multi-axis-line-chart',
    },
    xaxis: {
      categories: categories,
      tickAmount: 10,
    },
    yaxis: yAxesConfig,
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0,
    }
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export default LineChart


