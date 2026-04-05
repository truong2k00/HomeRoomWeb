import type { ThemeInstance } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

// 👉 Colors variables
const colorVariables = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`

  return { labelColor: themeDisabledTextColor, borderColor: themeBorderColor, legendColor: themeSecondaryTextColor }
}

// SECTION config

// 👉 Latest Bar Chart Config
export const getLatestBarChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }
}

// 👉 Horizontal Bar Chart Config
export const getHorizontalBarChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: {
      bar: {
        borderRadius: {
          topRight: 15,
          bottomRight: 15,
        },
      },
    },
    layout: {
      padding: { top: -4 },
    },
    scales: {
      x: {
        min: 0,
        grid: {
          drawTicks: false,
          drawBorder: false,
          color: borderColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        grid: {
          borderColor,
          display: false,
          drawBorder: false,
        },
        ticks: { color: labelColor },
      },
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: { color: legendColor },
      },
    },
  }
}

// 👉 Line Chart Config
export const getLineChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
      },
      y: {
        min: 0,
        max: 400,
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
      },
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

export function getLabelsDateISO(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });
}
export function getLabelsDateDM(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
  });
}

export function getLabelsDMDate(days: number, datasets: string[]): string[] {
  const datasetDates = new Set(
    datasets.map(dateStr => {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    })
  );

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));

    const isoDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Chỉ return nếu ngày tồn tại trong datasets
    if (!datasetDates.has(isoDate)) return null;

    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dd}/${mm}`;
  }).filter((item): item is string => item !== null); // loại bỏ null
}

export function getLabelsDMDateTos(startDate: Date, endDate: Date, datasets: string[]): string[] {
  const datasetDates = new Set(
    datasets.map(dateStr => {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    })
  );

  const result: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const isoDate = currentDate.toISOString().split('T')[0];
    if (datasetDates.has(isoDate)) {
      const dd = currentDate.getDate().toString().padStart(2, '0');
      const mm = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      result.push(`${dd}/${mm}`);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}


export const getLineChartAmountConfig = (themeColors: ThemeInstance['themes']['value']['colors'], maxy: number) => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
      },
      y: {
        min: 0,
        max: maxy,
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
      },
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Radar Chart Config
export const getRadarChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: { top: -20 },
    },
    scales: {
      r: {
        ticks: {
          display: false,
          maxTicksLimit: 1,
          color: labelColor,
        },
        grid: { color: borderColor },
        pointLabels: { color: labelColor },
        angleLines: { color: borderColor },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 25,
          color: legendColor,
        },
      },
    },
  }
}

// 👉 Polar Chart Config
export const getPolarChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45,
      },
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Bubble Chart Config
export const getBubbleChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 140,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 10,
          color: labelColor,
        },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }
}

// 👉 Doughnut Chart Config
export const getDoughnutChartConfig = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    cutout: 80,
    plugins: {
      legend: {
        display: false,
      },
    },
  }
}

// 👉 Scatter Chart Config
export const getScatterChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    layout: {
      padding: { top: -20 },
    },
    scales: {
      x: {
        min: 0,
        max: 140,
        grid: {
          borderColor,
          drawTicks: false,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 10,
          color: labelColor,
        },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          drawTicks: false,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Line Area Chart Config
export const getLineAreaChartConfig = (themeColors: ThemeInstance['themes']['value']['colors']) => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: -20 },
    },
    scales: {
      x: {
        grid: {
          borderColor,
          color: 'transparent',
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          color: 'transparent',
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

// !SECTION
