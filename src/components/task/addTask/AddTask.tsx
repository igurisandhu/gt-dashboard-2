import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { addTask, getTasks } from '@app/api/tasks.api';
import LeafletMaps from '@app/pages/GTMap/LeaftletMaps';
import { BaseDatePicker } from '@app/components/common/pickers/BaseDatePicker';
import moment from 'moment';
import { BaseCollapse } from '@app/components/common/BaseCollapse/BaseCollapse';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router-dom';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { Form } from 'antd';
import { BaseFormItem } from '@app/components/common/forms/components/BaseFormItem/BaseFormItem';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import TaskActionButton from './ActionButton';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { IJob, ITask } from '@app/interfaces/tasks';
import { Dayjs } from 'dayjs';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

function disabledDate(current: Dayjs) {
  return current && Number(current) < Number(moment().startOf('day'));
}

export const AddTask: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([{ id: 0 }]);
  const [addresses, setAddresses] = useState([{ address: '', latLng: [0, 0], type: 1 }]);
  const [activeKey, setActiveKey] = useState(['0']);
  const Team = useAppSelector((state) => state.team);
  const Agent = useAppSelector((state) => state.agent);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { _id } = useParams();

  const handleSubmit = (values: { [x: string]: any }) => {
    setLoading(true)

    const tasksData = tasks.map((task, index) => ({
      ...values[`task_${index}`],
      datetime: Number(values[`task_${index}`].datetime.valueOf()),
      location: {
        type: 'path',
        coordinates: addresses[index].latLng,
      },
    }));

    addTask({ task_id: tasksData, team_id: Team?._id, _id, agent_id: Agent?._id })
      .then(() => {
        notificationController.success({ message: 'Job Created Successfully' });
        navigate('/jobs');
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addNewTask = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    const newTaskId = tasks.length;
    setTasks([...tasks, { id: newTaskId }]);
    setAddresses([...addresses, { address: '', latLng: [0, 0], type: 1 }]);
    setActiveKey([newTaskId.toString()]);
  };

  const removeTask = (id: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (tasks.length === 1) return;
    setTasks(tasks.filter((task) => task.id !== id));
    setAddresses(addresses.filter((_address, index) => index !== id));
  };

  const setAddress = async (value: { label: any; value: any }, index: number) => {
    try {
      const response = await geocodeByPlaceId(value.value.place_id);
      if (response && Array.isArray(response) && response.length) {
        form.setFieldsValue({
          [`task_${index}`]: { address: value.label },
        });

        setAddresses((prevAddresses) => {
          const newAddresses = [...prevAddresses];
          newAddresses[index] = {
            address: value.label,
            latLng: [response[0].geometry.location.lat(), response[0].geometry.location.lng()],
            type: form.getFieldValue([`task_${index}`, 'type']),
          };
          return newAddresses;
        });
      }
    } catch (error: any) {
      console.error('Error setting address:', error);
    }
  };

  const moveTask = (fromIndex: number, toIndex: number) => {
    const newTasks = [...tasks];
    const newAddresses = [...addresses];
    [newTasks[fromIndex], newTasks[toIndex]] = [newTasks[toIndex], newTasks[fromIndex]];
    [newAddresses[fromIndex], newAddresses[toIndex]] = [newAddresses[toIndex], newAddresses[fromIndex]];
    setTasks(newTasks);
    setAddresses(newAddresses);
  };

  const getJob = async () => {
    try {
      setLoading(true);
      const response = await getTasks({ _id });

      if (!Array.isArray(response.data)) {
        const serverTasks: ITask[] | undefined = response.data.task_id;

        const formData: any = {};
        const newAddresses: any[] = [];

        if (serverTasks) {
          serverTasks.forEach((task: ITask, index: number) => {
            newAddresses[index] = {
              address: task.address,
              latLng: task.location?.coordinates || [],
              type: task.type,
            };

            // Ensure task structure matches with form field names
            formData[`task_${index}`] = {
              ...task,
              datetime: moment(task.datetime), // Convert datetime to moment object if needed
            };
          });

          // Update the state before setting form values
          setTasks(serverTasks.map((_, index) => ({ id: index })));
          setAddresses(newAddresses);
          setActiveKey(serverTasks.map((_, index) => index.toString()));
          // serverTasks.map(({ address }, index) => {
          //   setAddress({ label: address, value: address }, index);
          // });
          form.setFieldsValue(formData);
        }
      }
    } catch (error: any) {
      notificationController.error({ message: error?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Team) {
      navigate('/teams');
    }
    if (_id) {
      getJob();
    }
  }, [Team, navigate, _id]);

  return (
    <>
      <PageTitle>Add Job</PageTitle>
      <BaseRow gutter={[20, 20]}>
        <BaseCol xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <BaseForm
            style={{ padding: '10px' }}
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
            requiredMark="optional"
          >
            <div style={{ maxHeight: '74vh', overflow: 'auto' }}>
              {tasks.map((task, index) => (
                <BaseRow key={task.id} style={{ marginBottom: '20px' }}>
                  <BaseCol xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <BaseCollapse
                      activeKey={activeKey}
                      onChange={(keys) => setActiveKey(Array.isArray(keys) ? keys : [keys])}
                    >
                      <BaseCollapse.Panel
                        header={
                          <BaseRow justify="space-between" align="middle">
                            <BaseCol>
                              <h3>Task {index + 1}</h3>
                            </BaseCol>
                            <BaseCol>
                              <BaseRow gutter={[5, 0]} align="middle">
                                <TaskActionButton
                                  icon="↑"
                                  tooltip={t('tasks.move-up')}
                                  disabled={index === 0}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    moveTask(index, index - 1);
                                  }}
                                />
                                <TaskActionButton
                                  icon="↓"
                                  tooltip={t('tasks.move-down')}
                                  disabled={index === tasks.length - 1}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    moveTask(index, index + 1);
                                  }}
                                />
                                <TaskActionButton
                                  icon="+"
                                  tooltip={t('tasks.add-task')}
                                  disabled={index !== tasks.length - 1}
                                  onClick={addNewTask}
                                />
                                <TaskActionButton
                                  icon="-"
                                  tooltip={t('tasks.remove-task')}
                                  disabled={tasks.length === 1}
                                  onClick={(event) => removeTask(task.id, event)}
                                />
                              </BaseRow>
                            </BaseCol>
                          </BaseRow>
                        }
                        key={task.id.toString()}
                      >
                        <BaseFormItem
                          name={[`task_${index}`, 'address']}
                          label={'Address'}
                          rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                          <GooglePlacesAutocomplete
                            selectProps={{
                              onChange: (value) => value && setAddress(value, index),
                              value: { label: addresses[index].address, value: addresses[index].address },
                            }}
                            debounce={2000}
                            apiKey="AIzaSyCQFW0Khi-AoFWsr8SyEt1WKbC5fireFpc"
                          />
                        </BaseFormItem>
                        <BaseFormItem
                          name={[`task_${index}`, 'type']}
                          label={'Type'}
                          rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                          <BaseSelect
                            placeholder="Select Task Type"
                            options={[
                              { label: 'Pickup', value: 1 },
                              { label: 'Delivery', value: 2 },
                            ]}
                          />
                        </BaseFormItem>
                        <BaseFormItem
                          name={[`task_${index}`, 'name']}
                          label={'Name'}
                          rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                          <BaseInput placeholder={'James Bond'} type="text" />
                        </BaseFormItem>
                        <BaseFormItem
                          name={[`task_${index}`, 'phone']}
                          label={t('common.phone')}
                          rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                          <BaseInput placeholder={'9876543210'} type="number" />
                        </BaseFormItem>
                        <BaseFormItem
                          name={[`task_${index}`, 'datetime']}
                          label={'Date & Time'}
                          rules={[{ required: true, message: t('common.requiredField') }]}
                        >
                          <BaseDatePicker
                            placeholder={moment().format('YYYY-MM-DD HH:mm:ss')}
                            disabledDate={disabledDate}
                            style={{ width: '100%' }}
                            showTime
                            showSecond={false}
                          />
                        </BaseFormItem>
                      </BaseCollapse.Panel>
                    </BaseCollapse>
                  </BaseCol>
                </BaseRow>
              ))}
            </div>
            <BaseRow>
              <BaseCol xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} style={{ marginTop: '10px' }}>
                <BaseButton type="primary" style={{ width: '100%' }} htmlType="submit" loading={loading}>
                  {_id ? 'Update Job' : 'Create Job'}
                </BaseButton>
              </BaseCol>
            </BaseRow>
          </BaseForm>
        </BaseCol>
        <BaseCol xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <LeafletMaps
            locations={addresses}
            style={{
              border: 'solid 3px #85b3cc',
              borderRadius: '20px',
              height: '84vh',
            }}
          />
        </BaseCol>
      </BaseRow>
    </>
  );
};
