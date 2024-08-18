import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';

export const BarAnimationDelayChart: React.FC<{ name: string; data: Record<string, any>[] }> = ({ name, data }) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const [rawData, setRawData] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (data) {
      setRawData(data);
    }
  }, [data]);

  const option = {
    legend: {
      data: rawData.map((item: Record<string, any>) => item.name),
      left: 20,
      top: 0,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    grid: {
      left: 50,
      right: 20,
      bottom: 0,
      top: 70,
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      data: ['Today', 'Tommorow', 'Yesterday'],
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      name: 'Total',
      nameTextStyle: {
        padding: [0, -24],
        align: 'left',
      },
    },
    series: rawData.map((item, i) => ({
      name: item.name,
      type: 'line',
      data: [item.value, item.value - 1, item.value + 2],
      color: themeObject[theme][`chartColors${i}`],
      emphasis: {
        focus: 'series',
      },
    })),
    animationEasing: 'elasticOut',
  };
  return (
    <BaseCard padding="0 0 1.875rem" title={name}>
      <BaseChart option={option} />
    </BaseCard>
  );
};
