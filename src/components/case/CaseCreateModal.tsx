import { useState } from 'react';
import { Flex, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export default function CaseCreateModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Create Case"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Flex vertical gap={24}>
          <Input showCount onChange={() => {}} />
          <TextArea
            showCount
            maxLength={100}
            onChange={() => {}}
            placeholder="disable resize"
            style={{ height: 120, resize: 'none' }}
          />
        </Flex>
      </Modal>
    </>
  );
}
