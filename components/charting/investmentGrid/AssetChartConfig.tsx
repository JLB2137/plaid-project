import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import React, { useRef, useMemo } from 'react';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

type Dates = string[]
type Prices = number[]

const LineChart = ({ pricing }) => {
  
  if (!pricing||!pricing.apiResponse) {
    return <div>Charting for this Asset is Unavailable</div>;
  }

  const chartRef = useRef(null);

  const { dates , prices } = useMemo(() => {
    const dates: Dates = [];
    const prices: Prices = [];
    const symbolInformation = pricing.apiResponse;

    if (!symbolInformation) {
      return { dates: [], prices: [] };
    }

    for (let i = 0; i < symbolInformation.length; i++) {
      for (let j = 0; j < symbolInformation[i].timestamp.length; j++) {
        dates.push(
          new Date(symbolInformation[i].timestamp[j])
        );
        prices.push(symbolInformation[i].indicators.adjclose[0].adjclose[j]);
      }
    }

    return { dates, prices };
  }, [pricing]);

  //console.log('pricing',prices[0],prices[prices.length-1])
  // Memoize line color
  const lineColor = useMemo(
    () =>
      prices[0] < prices[prices.length - 1]
        ? 'rgba(0, 128, 0, 0.7)' // Green if price increases
        : 'rgba(255, 0, 0, 0.7)', // Red if price decreases or stays the same
    [prices]
  );

  // Memoize chart data
  const data = useMemo(
    () => ({
      labels: dates,
      datasets: [
        {
          data: prices,
          borderColor: lineColor,
          pointRadius: 0,
        },
      ],
    }),
    [dates, prices, lineColor]
  );

  // Memoize chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // Allow custom dimensions
      plugins: {
        legend: { display: false }, // Remove legend
        tooltip: { enabled: false }, // Disable tooltips
      },
      elements: {
        line: { tension: 0.1 }, // Slight curve for visual appeal
      },
      interaction: { mode: null }, // Remove all interactivity
      scales: {
        x: {
          display: false, // Remove X-axis labels
          grid: { display: false }, // Remove X-axis grid lines
          ticks: { display: false }, // Ensure X-axis ticks are hidden
        },
        y: {
          display: false, // Remove Y-axis labels
          grid: { display: false }, // Remove Y-axis grid lines
          ticks: { display: false }, // Ensure Y-axis ticks are hidden
        },
      },
      layout: {
        padding: { top: 5, bottom: 5, left: 5, right: 5 }, // Reduce chart padding
      },
    }),
    []
  );

  // Memoize custom plugin
  const dottedLinePlugin = useMemo(
    () => ({
      id: 'dottedLine',
      beforeDraw: (chart) => {
        const { ctx, scales, chartArea } = chart;
        const yValue = prices[0]; // First price point
        const yPosition = scales.y.getPixelForValue(yValue);

        // Draw dotted line
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.setLineDash([5, 5]); // Dotted line pattern
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, yPosition);
        ctx.lineTo(chartArea.right, yPosition);
        ctx.stroke();
        ctx.restore();
      },
    }),
    [prices]
  );

  // Handle case when no data is available
  if (!prices.length) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ width: '75px', height: '75px' }}>
      <Line
        ref={chartRef}
        options={options}
        data={data}
        plugins={[dottedLinePlugin]}
      />
    </div>
  );
};

export default LineChart;
