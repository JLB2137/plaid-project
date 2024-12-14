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
import React, { useRef } from 'react';
import { numberFormatting } from '../../lib/front-end/numberTextFormatting';

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
  const chartRef = useRef(null);

  let dates = [];
  let prices = [];

  const symbolInformation = pricing.stockPricing.apiResponse;

  console.log('here',pricing )



  for (let i = 0; i < symbolInformation.length; i++) {
    for (let j = 0; j < symbolInformation[i].timestamp.length; j++) {
      dates.push(
        new Date(symbolInformation[i].timestamp[j] * 1000).toUTCString()
      );
      prices.push(symbolInformation[i].indicators.adjclose[0].adjclose[j]);
    }
  }

  const lineColoring = () => {
    return prices[prices.length - 1] >= prices[0]
      ? 'rgb(0, 200, 7)'
      : 'rgb(255, 81, 1)';
  };

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Price',
        data: prices,
        xAxisID: 'xAxis',
        yAxisID: 'yAxis',
        borderColor: lineColoring(),
        pointRadius: 0,
        hoverRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: true, // Ensure legend is displayed
        labels: {
          generateLabels: (chart) => {
            // Custom logic to highlight the hovered label
            const activeLabelIndex =
              chart.options.plugins.customHover?.activeLabelIndex;
            return chart.data.datasets.map((dataset) => ({
              text:
                activeLabelIndex !== undefined
                  ? `${chart.data.labels[activeLabelIndex].slice(
                      0,
                      17
                    )}: $${numberFormatting(dataset.data[activeLabelIndex])}`
                  : dataset.label,
              strokeStyle: 'transparent',
              fillStyle: 'transparent',
            }));
          },
        },
      },
      title: {
        display: true,
        text: 'Daily Pricing Information Annualized',
      },
    },
    elements: {
      line: {
        borderColor: lineColoring(),
      },
      point: {
        hitRadius: 10,
        pointRadius: 0,
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    onHover: (event) => {
      const chart = chartRef.current;
      if (chart) {
        const xAxisElements = chart.getElementsAtEventForMode(
          event.native,
          'index',
          { intersect: false },
          false
        );

        if (xAxisElements.length > 0) {
          const xAxisIndex = xAxisElements[0].index;

          // Update chart options dynamically to reflect hover
          chart.options.plugins.customHover = {
            activeLabelIndex: xAxisIndex,
          };
          chart.update();
        }
      }
    },
    scales: {
      xAxis: {
        title: {
          display: true,
          text: 'Date',
          color: 'black',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          callback: function (value, index) {
            return index % 2 === 0 ? data.labels[index].slice(0, 17) : '';
          },
        },
      },
      yAxis: {
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
          stepSize: 100,
        },
        title: {
          display: true,
          text: 'Price',
          color: 'black',
        },
      },
    },
  };

  const customPlugin = {
    id: 'customVerticalLine',
    beforeDraw: (chart) => {
      const { ctx, chartArea, scales } = chart;
      const activeIndex = chart.options.plugins.customHover?.activeLabelIndex;

      if (activeIndex !== null) {
        const xPosition = scales.xAxis.getPixelForValue(activeIndex);

        // Draw vertical line
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xPosition, chartArea.top);
        ctx.lineTo(xPosition, chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  return (
    <Line ref={chartRef} options={options} data={data} plugins={[customPlugin]} />
  );
};

export default LineChart;
