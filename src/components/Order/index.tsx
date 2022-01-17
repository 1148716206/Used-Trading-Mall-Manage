import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {DatePicker, Space, Button, Input, Table, Form, Select, message, Modal} from 'antd';
const {Option} = Select;
import request from '@/http';
import moment from 'moment';
import UserInfo from "@/components/User";
// import { OperateModal, UserEditObject } from './OperateModal';

const Order = () => {
  const [formObject] = Form.useForm();
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    total: 10,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '50', '200', '500'],
    showQuickJumper: true,
  });

/*  const [currentEditObject, setCurrentEditObject] =
    React.useState<UserEditObject>({
      isModalVisible: false,
    });*/

  const loadDataSource = async (
    userParams: any,
    pageValue: any,
    pageSize: any,
  ) => {
    const result: any = await request.get('/api/getOrderInfo')
    console.log(result)
    if(result && result.data.code === 200) {
      const data: any = result.data.msg.map((user:any) => ({
        key: `user_${user.id}`,
        id: user.id,
        Uid: user.Uid,
        Sid: user.Sid,
        status: user.status,
        count: user.count,
        createTime: user.create_time,
        updateTime: user.update_time,
        payType: user.pay_type,
        address: user.address,
        phone: user.phone
      }))
      setDataSource(data)
    }


  };

  const searchOnClick = async () => {
    const data = formObject.getFieldsValue()
    console.log(data)
    let dataStr = ''
    let ds = {
      ...data
    }
    for (var i in ds) {
      if (dataStr !== '') dataStr += '&'
      dataStr += encodeURIComponent(i) + '=' + encodeURIComponent(ds[i])
    }
    console.log(dataStr)
    await loadDataSource(ds, 1, pagination.pageSize);
  };

  useEffect(() => {
    loadDataSource(null, 1, pagination.pageSize).finally();
  }, []);


  const pageOnChange = async (page: any) => {
    await loadDataSource(formObject.getFieldsValue(), page.current, page.pageSize);
  };



//重置按钮
  const resetOnClick = () => {
    formObject.resetFields()
  };


/*  async function userEditOnClose() {
    await loadDataSource(
      formObject.getFieldsValue(),
      pagination.current,
      pagination.pageSize,
    );
  }*/

  return (
    <div className={styles.pageContent}>
      <div className={styles.search} >
        <div className={styles.search__form}>
          <Form layout='inline' form={formObject}>
            <Space>
              <Form.Item label="用户 ID" name="Uid" initialValue="">
                <Input placeholder="请输入..."/>
              </Form.Item>
              <Form.Item label="商品 ID" name="Sid" initialValue="">
                <Input placeholder="请输入..."/>
              </Form.Item>
              <Form.Item label="支付方式" name="payType" initialValue="all">
                <Select
                  defaultValue="支付方式"
                  style={{ width: 100 }}
                >
                  <Option value="all">全部方式</Option>
                  <Option value="Alipay">支付宝</Option>
                  <Option value="wechatPay">微信支付</Option>
                  <Option value="CMB">招商银行</Option>
                </Select>
              </Form.Item>
              <Form.Item label="联系电话" name="phone">
                <Input className='studentInput' placeholder="请输入..."/>
              </Form.Item>
              <Button
                type="primary"
                onClick={searchOnClick}
              >
                查询
              </Button>

              <Button onClick={resetOnClick}>重置</Button>
            </Space>

          </Form>
        </div>
      </div>

      <div className={styles.mainTable}>
        <Table
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              width: 50,
              align: 'center',
            }, {
              title: '商品Id',
              dataIndex: 'Sid',
              key: 'Sid',
              width: 75,
              align: 'center',
            }, {
              title: '数量',
              dataIndex: 'count',
              key: 'count',
              width: 50,
              align: 'center',
            }, {
              title: '用户Id',
              dataIndex: 'Uid',
              key: 'Uid',
              width: 75,
              align: 'center',
            }, {
              title: '联系电话',
              dataIndex: 'phone',
              key: 'phone',
              width: 75,
              align: 'center',

            }, {
              title: '收货地址 ',
              dataIndex: 'address',
              key: 'address',
              width: 150,
              align: 'center',
            }, {
              title: '支付方式 ',
              dataIndex: 'payType',
              key: 'payType',
              width: 50,
              align: 'center',
            }, {
              title: '创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              width: 75,
              render: createTime => moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
              align: 'center',
            }, {
              title: '修改时间',
              dataIndex: 'updateTime',
              key: 'updateTime',
              width: 75,
              render: updateTime => updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无',
              align: 'center',
            }, {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 75,
              align: 'center',
              render: status => (status === 1 ? '已签收' : '未签收')
            }, {
              title: '操作',
              key: 'action',
              align: 'center',
              width: 50,
              render: (row: any) => (
                <>
                  <Button
                    type="link"
                    onClick={() => {
                   /*   setCurrentEditObject({
                        isModalVisible: true
                      })*/
                    }}
                  >
                    编辑
                  </Button>
                </>
              ),
            },
          ]}
          dataSource={dataSource}
          pagination={pagination}
          onChange={pageOnChange}
          tableLayout="fixed"
          bordered
        />

      </div>
  {/*    <OperateModal
        editObject={currentEditObject}
        onClose={userEditOnClose}
      />*/}

    </div>
  );
};


export default Order;
