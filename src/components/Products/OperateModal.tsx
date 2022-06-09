import React, { Fragment, useEffect, useState } from 'react';
import {
  Select,
  InputNumber,
  Input,
  Modal,
  Popconfirm,
  message,
  Form,
} from 'antd';
import styles from './OperateModal.less';
import request from '@/http';
import qs from 'qs';

const { Option } = Select;

interface UserEditObject {
  isModalVisible: boolean;
  goods_id?: number;
  username?: string;
  goods_name?: string;
  goods_number?: number;
  browse_num?: number;
}

const OperateModal = (props: { editObject: UserEditObject; onClose: any }) => {
  const { editObject, onClose } = props;
  console.log(props);

  const [modalVisible, setModalVisible] = useState(false);
  const [formObject] = Form.useForm();

  useEffect(() => {
    setModalVisible(editObject.isModalVisible);
    if (editObject.goods_id !== null) {
      formObject.setFieldsValue({
        goods_name: editObject.goods_name,
        goods_number: editObject.goods_number,
        browse_num: editObject.browse_num,

      });
    }
  }, [editObject]);

  const modelOnOk = async () => {
    const formData = await formObject.validateFields();
    const sendData = {
      ...formData,
      goods_id:editObject.goods_id
    }
    console.log('sendData', sendData);
    const {data}: any = await request.post(
      '/api/manageUpdateGoods',
      qs.stringify(sendData),
    );
    console.log(data);
    if (data.status === 200) {
      setTimeout(() => {
        message.success(data.msg);
      }, 500);
      if (onClose) {
        //点击取消  关闭窗口
        onClose();
      }
      setModalVisible(false); // 关闭窗口
    }
  };

  const modelOnCancel = () => {
    setModalVisible(false);
  };

  return (
    <Fragment>
      <Modal
        title="编辑商品信息"
        visible={modalVisible}
        onOk={modelOnOk}
        onCancel={modelOnCancel}
        destroyOnClose
        cancelText="取消"
				okText="确定"
      >
        <Form
          className="form"
          name="editForm"
          form={formObject}
          preserve={false}

        >
          <div className={styles.add_form}>
            <Form.Item  label="商&nbsp;&nbsp;品&nbsp;&nbsp;名" name="goods_name" initialValue="">
              <Input placeholder="请输入..." />
            </Form.Item>
            <Form.Item  label="商品数量" name="goods_number" initialValue="">
              <InputNumber style={{width:184}} placeholder="请输入..." min={0} />
            </Form.Item>
            <Form.Item  label="浏&nbsp;&nbsp;览&nbsp;&nbsp;量" name="browse_num" initialValue="">
              <InputNumber  style={{width:184}} placeholder="请输入..." min={0} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Fragment>
  );
};

export { OperateModal, UserEditObject };
