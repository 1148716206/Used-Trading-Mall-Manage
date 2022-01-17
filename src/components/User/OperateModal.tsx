import React, { Fragment, useEffect, useState } from 'react';
import { Select,Space, Input, Modal, Popconfirm, message, Form} from 'antd';
import styles from './OperateModal.less'
const { Option } = Select;
interface UserEditObject {
  isModalVisible: boolean,
  modalType: string,
  id?: number,
  username?: string,
  gender?: number,
  address?: string,
  phone?: number
}


const OperateModal = (props: { editObject: UserEditObject; onClose: any}) => {
  const { editObject, onClose } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [formObject] = Form.useForm();


  useEffect(() => {
    setModalVisible(editObject.isModalVisible);
    if (editObject.id !== null) {
      formObject.setFieldsValue({
        name: editObject.username,
      });
    }
  }, [editObject]);


  const modelOnCancel = () => {
    setModalVisible(false);
  };


  return (
    <Fragment>
      <Modal
        title={ editObject.modalType ? ' 新增用户' : '编辑用户信息'}
        visible={modalVisible}
        onCancel={modelOnCancel}
        destroyOnClose
      >
        <Form
          className="form"
          name="editForm"
          form={formObject}
          preserve={false}
        >
      {
        editObject.modalType ? (
        <div className={styles.add_form}>
          <Form.Item
            label="用&nbsp;&nbsp;户&nbsp;&nbsp;名"
            name="username"
            initialValue=""
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入..."/>
          </Form.Item>
          <Form.Item
            label="性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别"
            className="OMSelect"
            name="gender"
            initialValue=""
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value=''>请选择</Option>
              <Option value={1}>男</Option>
              <Option value={0}>女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            initialValue=""
            rules={[{ required: true, message: '请输入电话号码' }]}
          >
            <Input placeholder="请输入..."/>
          </Form.Item>
          <Form.Item
            label="收货地址"
            name="address"
            initialValue=""
            rules={[{ required: true, message: '请输入收货地址' }]}
          >
            <Input placeholder="请输入..."/>
          </Form.Item>
          <Form.Item
            className="OMSelect"
            label="权限等级"
            name="level"
            initialValue=""
            rules={[{ required: true, message: '请选择权限等级' }]}
          >
            <Select>
              <Option value=''>请选择</Option>
              <Option value={0}>普通用户</Option>
              <Option value={1}>管理员</Option>
            </Select>
          </Form.Item>
        </div>
        ) : (<div className={styles.add_form}>
            <Form.Item label="用户 ID" name="name" initialValue="">
              <Input placeholder="请输入..."/>
            </Form.Item>
            <Form.Item label="用户 ID" name="name" initialValue="">
              <Input placeholder="请输入..."/>
            </Form.Item>
          </div>
        )
      }
        </Form>
      </Modal>
    </Fragment>
  );
};

export { OperateModal, UserEditObject };
