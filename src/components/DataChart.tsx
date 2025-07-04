import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

interface TempChartProps {
  periods: { temperature: any; time: any; humidity: any; precipitation: any }[];
  is12Hour: boolean;
  chartDataType: "temperature" | "humidity" | "precipitation";
}

// Helper to draw the stripe pattern on a canvas
const drawStripePattern = (stripeCanvas: HTMLCanvasElement, scale: number) => {
  const stripeCtx = stripeCanvas.getContext("2d");
  if (stripeCtx) {
    const polygons = [
      {
        fillStyle: document.body.classList.contains("dark")
          ? "rgba(255,255,255,0.5)"
          : "rgba(0,0,0,0.25)",
        points: [
          [
            [0, 0],
            [20 * scale, 0],
            [0, 20 * scale],
          ],
          [
            [0, 40 * scale],
            [40 * scale, 0],
            [40 * scale, 20 * scale],
            [20 * scale, 40 * scale],
          ],
        ],
      },
      {
        fillStyle: document.body.classList.contains("dark")
          ? "rgba(255,255,255,0.25)"
          : "rgba(0,0,0,0.5)",
        points: [
          [
            [40 * scale, 40 * scale],
            [20 * scale, 40 * scale],
            [40 * scale, 20 * scale],
          ],
          [
            [0, 40 * scale],
            [40 * scale, 0],
            [20 * scale, 0],
            [0, 20 * scale],
          ],
        ],
      },
    ];
    polygons.forEach(({ fillStyle, points }) => {
      stripeCtx.fillStyle = fillStyle;
      points.forEach((poly) => {
        stripeCtx.beginPath();
        stripeCtx.moveTo(poly[0][0], poly[0][1]);
        poly.slice(1).forEach(([x, y]) => stripeCtx.lineTo(x, y));
        stripeCtx.closePath();
        stripeCtx.fill();
      });
    });
  }
  return stripeCanvas;
};

// Returns a CanvasPattern for the chart background
const getStripePattern = (ctx: CanvasRenderingContext2D, scale: number) => {
  const stripeCanvas = document.createElement("canvas");
  stripeCanvas.width = 40 * scale;
  stripeCanvas.height = 40 * scale;
  drawStripePattern(stripeCanvas, scale);
  return ctx.createPattern(stripeCanvas, "repeat") || undefined;
};

function DataChart({ periods, is12Hour, chartDataType }: TempChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let chartInstance: Chart | null = null;

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      let backgroundColor: CanvasPattern | undefined = undefined;
      if (ctx) {
        backgroundColor = getStripePattern(ctx, 0.75);
      }

      chartInstance = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: periods.map((val, idx) => {
            let time = new Date(val.time)
              .toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: is12Hour,
              })
              .replace(/(AM|PM)$/, "")
              .replace(/^0/, "")
              .trim();
            // If window width <= 600, clear every odd index label
            if (window.innerWidth <= 600 && idx % 2 === 1) {
              return "";
            }
            return time;
          }),
          datasets: [
            {
              label: "",
              data: periods.map((val) => {
                if (chartDataType === "temperature") return val.temperature;
                if (chartDataType === "humidity") return val.humidity;
                if (chartDataType === "precipitation") return val.precipitation;
                return null;
              }),
              fill: true,
              backgroundColor,
              borderColor: "rgb(255, 255, 255)",
              borderWidth: 3,
              tension: 0.5,
              borderCapStyle: "round",
              pointBackgroundColor: "#fff",
              pointBorderColor: "#fff",
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              color: "#fff",
              align: "top",
              font: {
                weight: "normal",
                family: "Roboto, Arial, sans-serif",
                size: 24,
              },
              formatter: (value: number, context: any) => {
                // If window width <= 600 and odd index, clear label
                if (window.innerWidth <= 600 && context.dataIndex % 2 === 1) {
                  return "";
                }
                let point =
                  value +
                  (chartDataType == "humidity" ||
                  chartDataType == "precipitation"
                    ? "%"
                    : "");
                return point;
              },
              display: true,
            },
            legend: {
              display: false,
            },
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#fff",
                font: {
                  family: "Roboto, Arial, sans-serif",
                  size: 20,
                },
                callback: function (val, index) {
                  return window.innerWidth > 600 || index % 2 === 0
                    ? this.getLabelForValue(Number(val))
                    : "";
                },
              },
              border: {
                display: false,
              },
            },
            y: {
              min: Math.max(
                Math.min(...periods.map((val) => val[chartDataType])) - 1,
                chartDataType != "temperature" ? 0 : Number.MIN_SAFE_INTEGER
              ),
              max: Math.max(...periods.map((val) => val[chartDataType])) + 5,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
                color: "#fff",
                font: {
                  family: "Roboto, Arial, sans-serif",
                  size: 20,
                },
              },
              border: {
                display: false,
              },
            },
          },
        },
      });
    }
    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [periods, chartDataType, is12Hour]);

  return <canvas id="tempChart" ref={canvasRef}></canvas>;
}

export default DataChart;
