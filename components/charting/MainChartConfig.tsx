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
import React, { useRef, useMemo, useEffect, FC } from 'react';
import { numberFormatting } from '../../lib/front-end/numberTextFormatting';
import { useFinancialsContext } from '../../context/FinancialsContext';
import { ChartData } from '../../types/types';

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

interface LineChartProps {
  pricing: {
    apiResponse: ChartData["chart"]["result"] | ChartData["chart"]["error"];
  };
}


const LineChart = ({ pricing } ) => {
  const chartRef = useRef(null);


  // Accessing context
  const { setSelectedPrice, setInitialRangePrice } = useFinancialsContext();
  if(!pricing){
    return <div></div>
  }

  // Extract and memoize dates and prices
  const { dates, prices } = useMemo(() => {
    const dates = [];
    const prices = [];

    for (let i = 0; i < pricing.length; i++) {
        dates.push(pricing[i].date);
        prices.push(pricing[i].close);
    }
    return { dates, prices };
  }, [pricing]);

  // Set initial range price and selected price on load
  useEffect(() => {
    if (prices.length) {
      setInitialRangePrice(prices[0]);
      setSelectedPrice(prices[prices.length - 2]);
    }
  }, [prices, setInitialRangePrice, setSelectedPrice]);

  // Memoize line color
  const lineColoring = useMemo(
    () =>
      prices[prices.length - 1] >= prices[0]
        ? 'rgb(0, 200, 7)' // Green if price increases
        : 'rgb(255, 81, 1)', // Red if price decreases
    [prices]
  );

  // Memoize chart data
  const data = useMemo(
    () => ({
      labels: dates,
      datasets: [
        {
          label: 'Price',
          data: prices,
          borderColor: lineColoring,
          pointRadius: 0,
          hoverRadius: 10,
        },
      ],
    }),
    [dates, prices, lineColoring]
  );

  // Memoize chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0,
      },
      plugins: {
        legend: {
          position: 'top',
          display: true,
          labels: {
            generateLabels: (chart) => {
              const activeLabelIndex =
                chart.options.plugins.customHover?.activeLabelIndex;

              return [
                {
                  text:
                    activeLabelIndex !== undefined
                      ? `${chart.data.labels[activeLabelIndex].slice(
                          0,
                          17
                        )}: $${numberFormatting(
                          chart.data.datasets[0].data[activeLabelIndex]
                        )}`
                      : chart.data.datasets[0].label,
                  fontColor:
                    activeLabelIndex !== undefined &&
                    chart.data.datasets[0].data[activeLabelIndex] > prices[0]
                      ? 'rgb(0, 200, 7)' // Green for increase
                      : activeLabelIndex !== undefined
                      ? 'rgb(255, 81, 1)' // Red for decrease
                      : '#000', // Default color
                },
              ];
            },
          },
        },
      },
      elements: {
        line: {
          borderColor: lineColoring,
        },
        point: {
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

            // Save only the hovered price to context
            setSelectedPrice(prices[xAxisIndex]);

            // Update chart options dynamically to reflect hover
            chart.options.plugins.customHover = {
              activeLabelIndex: xAxisIndex,
            };
            chart.draw(); // Redraw without recalculating data
          }
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
            callback: (value, index) => (index % 2 === 0 ? dates[index] : ''),
          },
        },
        y: {
          ticks: {
            callback: (value) => `$${value}`,
            stepSize: 100,
          },
        },
      },
    }),
    [dates, lineColoring, prices, setSelectedPrice]
  );

  // Memoize custom plugin
  const customPlugin = useMemo(
    () => ({
      id: 'customVerticalLine',
      beforeDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        const activeIndex = chart.options.plugins.customHover?.activeLabelIndex;

        if (activeIndex !== undefined && activeIndex !== null) {
          const xPosition = scales.x.getPixelForValue(activeIndex);

          // Draw vertical line
          ctx.save();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.setLineDash([5, 5]); // Dotted line
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xPosition, chartArea.top);
          ctx.lineTo(xPosition, chartArea.bottom);
          ctx.stroke();
          ctx.restore();
        }
      },
    }),
    []
  );

  // Handle case when no data is available
  if (!prices.length) {
    return <div>No data available</div>;
  }

  return (
    <Line
      ref={chartRef}
      options={options}
      data={data}
      plugins={[customPlugin]}
    />
  );
};

export default LineChart;
