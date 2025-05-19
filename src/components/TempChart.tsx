import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

interface TempChartProps {
  periods: { temperature: any; time: any }[];
  is12Hour: boolean;
}

function TempChart({ periods, is12Hour }: TempChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let chartInstance: Chart | null = null;

    if (canvasRef.current) {
      // Create a repeating striped pattern
      const ctx = canvasRef.current.getContext("2d");
      let backgroundColor: CanvasPattern | undefined = undefined;
      if (ctx) {
        const stripeCanvas = document.createElement("canvas");
        let scale = 0.75;

        stripeCanvas.width = 40 * scale;
        stripeCanvas.height = 40 * scale;
        const stripeCtx = stripeCanvas.getContext("2d");
        if (stripeCtx) {
          // Fill left half transparent (default)
          // Fill right half with semi-transparent

          stripeCtx.fillStyle = "rgba(255,255,255,0.25)";
          stripeCtx.moveTo(0, 0);
          stripeCtx.beginPath();
          stripeCtx.lineTo(20 * scale, 0);
          stripeCtx.lineTo(0, 20 * scale);
          stripeCtx.lineTo(0, 0);
          stripeCtx.closePath();
          stripeCtx.fill();

          stripeCtx.moveTo(0, 40 * scale);
          stripeCtx.beginPath();
          stripeCtx.lineTo(40 * scale, 0);
          stripeCtx.lineTo(40 * scale, 20 * scale);
          stripeCtx.lineTo(20 * scale, 40 * scale);
          stripeCtx.lineTo(0, 40 * scale);
          stripeCtx.closePath();
          stripeCtx.fill();

          stripeCtx.fillStyle = "rgba(0,0,0,0.25)";
          stripeCtx.moveTo(40 * scale, 40 * scale);
          stripeCtx.beginPath();
          stripeCtx.lineTo(20 * scale, 40 * scale);
          stripeCtx.lineTo(40 * scale, 20 * scale);
          stripeCtx.lineTo(40 * scale, 40 * scale);
          stripeCtx.closePath();
          stripeCtx.fill();

          stripeCtx.moveTo(0, 40 * scale);
          stripeCtx.beginPath();
          stripeCtx.lineTo(40 * scale, 0);
          stripeCtx.lineTo(20 * scale, 0);
          stripeCtx.lineTo(0, 20 * scale);
          stripeCtx.lineTo(0, 40 * scale);
          stripeCtx.closePath();
          stripeCtx.fill();
        }
        backgroundColor =
          ctx.createPattern(stripeCanvas, "repeat") || undefined;
      }

      chartInstance = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: periods.map((val) =>
            new Date(val.time)
              .toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: is12Hour, // Use 12-hour clock
              })
              .replace(/(AM|PM)$/, "")
              .replace(/^0/, "")
              .trim()
          ),
          datasets: [
            {
              label: "",
              data: periods.map((val) => val.temperature),
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
              formatter: (value: number) => value,
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
              },
              border: {
                display: false,
              },
            },
            y: {
              min: Math.min(...periods.map((val) => val.temperature)) - 1,
              max: Math.max(...periods.map((val) => val.temperature)) + 5,
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
  }, [periods]);

  return <canvas id="tempChart" ref={canvasRef}></canvas>;
}

export default TempChart;
