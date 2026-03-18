import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  option: echarts.EChartsOption;
  height?: number;
}

export function Chart({ option, height = 280 }: ChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption(option);
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [option]);

  return <div ref={ref} style={{ width: '100%', height }} />;
}
