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
import moment from 'moment';

const { Option } = Select;

interface UserEditObject {
  isModalVisible: boolean;
  key: number;
  id?: number;
  username?: string;
  goods_name?: string;
  goods_num?: number;
  browse_num?: number;
  goods_id: number;
  goods_img: string;
  goods_price: string;
  create_time: string;
  sum: number;
  phone: number;
  address: string;
  update_time: string;
  payment: string;
  status: number;
}

const OperateModal = (props: { editObject: UserEditObject; onClose: any }) => {
  const { editObject, onClose } = props;
  console.log(props);

  const [modalVisible, setModalVisible] = useState(false);
  const [formObject] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  useEffect(() => {
    setModalVisible(editObject.isModalVisible);
    if (editObject.id !== null) {
      formObject.setFieldsValue({
        goods_name: editObject.goods_name,
        goods_num: editObject.goods_num,
        browse_num: editObject.browse_num,
      });
    }
  }, [editObject]);

  const modelOnOk = async () => {
    const data = await formObject.validateFields();

    console.log('获取的表单', data);
    const sendData = {
      ...data,
      id: editObject.id,
      create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    const result: any = await request.post(
      '/api/manageUpdateOrder',
      qs.stringify(sendData),
    );
    console.log(result);
    if (result.data.code === 200) {
      setTimeout(() => {
        message.success('添加成功');
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
            <Form.Item
              name="goods_name"
              label="商品名称"
              rules={[
                {
                  required: true,
                  message: '请输入商品名称!',
                },
              ]}
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>
            <Form.Item
              name="goods_num"
              label="数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量"
              rules={[
                {
                  required: true,
                  message: '请输入数量!',
                },
              ]}
            >
              <InputNumber
                style={{ width: 184 }}
                placeholder="请输入..."
                min={0}
              />
            </Form.Item>
            <Form.Item
              label="收&nbsp;&nbsp;件&nbsp;&nbsp;人"
              name="username"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: '请输入收件人!',
                },
              ]}
            >
              <Input placeholder="请输入..." />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="phone"
              initialValue=""
              rules={[
                { required: true, message: '请输入电话号码' },
                { min: 11, max: 11, message: '请输入正确的电话号码' },
              ]}
            >
              <Input placeholder="请输入..." />
            </Form.Item>
            <Form.Item
              name="payment"
              label="支付方式"
              rules={[
                {
                  required: true,
                  message: '请选择支付方式',
                },
              ]}
            >
              <Select
                style={{ width: 180 }}
                initialValue=""
                placeholder="请选择支付方式"
              >
                <Option value="Alipay">支付宝</Option>
                <Option value="WeChatPay">微信支付</Option>
                <Option value="CMB">招商银行</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态"
              name="status"
              initialValue={null}
              rules={[
                {
                  required: true,
                  message: '请选择支付方式',
                },
              ]}
            >
              <Select style={{ width: 180 }} defaultValue="状态">
                <Option value={null}>全部状态</Option>
                <Option value={0}>待发货</Option>
                <Option value={1}>待收货</Option>
                <Option value={2}>待评价</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Fragment>
  );
};

export { OperateModal, UserEditObject };
