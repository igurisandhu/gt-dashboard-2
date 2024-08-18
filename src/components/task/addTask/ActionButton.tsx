import React from 'react';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseTooltip } from '@app/components/common/BaseTooltip/BaseTooltip';

interface TaskActionButtonProps {
  icon: string;
  tooltip: string;
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TaskActionButton: React.FC<TaskActionButtonProps> = ({ icon, tooltip, disabled, onClick }) => {
  return (
    <BaseTooltip showArrow title={tooltip}>
      <BaseButton
        type="primary"
        style={{
          fontSize: '16px',
          color: disabled ? 'lightgray' : 'silver',
          borderColor: disabled ? 'lightgray' : 'silver',
          background: 'white',
          width: '35px',
          height: '35px',
          borderRadius: '5px',
          marginRight: '5px',
        }}
        size="small"
        shape="default"
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </BaseButton>
    </BaseTooltip>
  );
};

export default TaskActionButton;
