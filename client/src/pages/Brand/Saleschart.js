// Import React and useRef
import React, { useRef } from 'react';
import { Column } from '@ant-design/charts';

export const SalesChart = ({ data }) => {
  // useRef example usage (even if not needed, just for demonstration)
  const chartRef = useRef(null);

  const config = {
    data,
    isGroup: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'name',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' }
      ],
    },
    tooltip: { shared: true, showMarkers: false },
    meta: {
      type: { alias: 'Category' },
      value: { formatter: (v) => `${v} units` },
    },
    chartRef, // assuming Ant Design Charts supports a ref prop to access the chart instance
  };

  return <Column {...config} />;
};
