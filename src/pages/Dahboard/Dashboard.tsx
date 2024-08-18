import React, { useEffect, useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { PieChart } from '@app/components/common/charts/PieChart';
import { useTranslation } from 'react-i18next';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { getMetrics, IGetMetricsResponse } from '@app/api/common.api';
import { notificationController } from '@app/controllers/notificationController';
import { BarAnimationDelayChart } from './LineChat';
import { Loading } from '@app/components/common/Loading/Loading';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metricsData, setMetricsData] = useState<Record<string, any>[][]>([]);
  const [metricNames, setMetricNames] = useState<string[]>([]);
  const { t } = useTranslation();

  const fetchMetricsData = async () => {
    try {
      setIsLoading(true);
      const response: IGetMetricsResponse = await getMetrics(0, 0);
      const responseData = response.data;

      const processedData: Record<string, any>[][] = [];
      const names = Object.keys(responseData);

      setMetricNames(names);

      names.forEach((metricName: string) => {
        const metricData: { name: string; value: number }[] = [];
        for (const key in responseData[metricName]) {
          const name: string = key.split('_').join(' ');
          const dataPoint = {
            name: name[0].toUpperCase() + name.slice(1).toLowerCase(),
            value: responseData[metricName][key],
          };
          metricData.push(dataPoint);
        }
        console.log(metricData);
        processedData.push(metricData);
      });

      setMetricsData(processedData);
    } catch (error: any) {
      notificationController.error({ message: error?.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, []);

  return (
    <>
      {isLoading && (
        <div style={{ width: '100%', height: '85vh', display: 'flex', justifyContent: 'center' }}>
          <Loading color="#ADD8E6" size="100px" />
        </div>
      )}
      <PageTitle>{t('Dashboard')}</PageTitle>
      <BaseRow gutter={[30, 30]}>
        {metricNames.map((metricName: string, index: number) => (
          <BaseCol key={index} xxl={12} xl={12} xs={24}>
            <BaseCard padding="0 0 1.875rem" title={metricName.toUpperCase()}>
              <PieChart
                // option={{ isLoading }}
                data={metricsData[index]}
                name={metricName.toUpperCase()}
                showLegend={true}
              />
            </BaseCard>
          </BaseCol>
        ))}
      </BaseRow>
      <BaseRow style={{ marginTop: 30 }} gutter={[30, 30]}>
        {metricNames.map((metricName: string, index: number) => (
          <BaseCol key={index} xxl={24} xl={24} xs={24}>
            <BarAnimationDelayChart data={metricsData[index]} name={metricName.toUpperCase()} />
          </BaseCol>
        ))}
      </BaseRow>
    </>
  );
};

export default DashboardPage;
