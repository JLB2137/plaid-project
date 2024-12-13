import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = (pricing) => {

  const dates:string[] = []
  const prices:number[] =[]

  console.log('pricingher',)

  const symbolInformation = pricing.stockPricing.apiResponse

  for(let i=0;i<symbolInformation.length;i++){
    for(let j=0;j<symbolInformation[i].timestamp.length;j++){
      dates.push(
        new Date(symbolInformation[i].timestamp[j]*1000).toUTCString()
      )
      prices.push(
        symbolInformation[i].indicators.adjclose[0].adjclose[j]
      )
    }
  }



    
  const data = {
    labels: dates,
    datasets: [
      {
        label: symbolInformation[0].meta.symbol,
        data: prices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales',
      },
    },
  };

  return <Line options={options} data={data}/>;
};

export default LineChart;