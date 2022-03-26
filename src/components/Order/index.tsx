import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {DatePicker, Space, Button, Input, Table, Form, Select, message, Modal} from 'antd';
const {Option} = Select;
import request from '@/http';
import moment from 'moment';
import qs from 'qs';

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
    pageCurrent: any,
    pageSize: any,
  ) => {
    const ds = {
      ...userParams,
      current: pageCurrent,
      size: pageSize,
    };
    const {data}: any = await request.post('api/manageOrder',qs.stringify(ds))

console.log('订单data',data)
    if(data && data.status === 200) {
      const newData: any = data.data.map((user:any) => ({
        key: `user_${user.id}`,
        id: user.id,
        goods_name: user.goods_name,
        goods_id: user.goods_id,
        goods_num: user.goods_num,
        username: user.username,
        user_phone: user.user_phone,
        user_address: user.user_address,

        create_time: user.create_time,
        update_time: user.update_time,
        payment: user.payment,
        status: user.status
      }))
      const newPageObject = {
        ...pagination,
        current: pageCurrent,
        pageSize,
        total: data.total
      }
      setDataSource(newData)
      setPagination(newPageObject)
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
    console.log('查询',ds)
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
              <Form.Item label="商品 ID" name="goods_id" initialValue="">
                <Input placeholder="请输入..."/>
              </Form.Item>
              <Form.Item label="商品名称" name="goods_name" initialValue="">
                <Input placeholder="请输入..."/>
              </Form.Item>
              <Form.Item label="用户" name="username" initialValue="">
                <Input placeholder="请输入..."/>
              </Form.Item>
              <Form.Item label="联系电话" name="phone">
                <Input className='studentInput' placeholder="请输入..."/>
              </Form.Item>
              <Form.Item label="状态" name="status" initialValue={null}>
              <Select
                  defaultValue="状态"
                  style={{ width: 100 }}
                >
                  <Option value={null}>全部状态</Option>
                  <Option value={0}>待发货</Option>
                  <Option value={1}>待收货</Option>
                  <Option value={2}>待评价</Option>
                </Select>
              </Form.Item>
              <Form.Item label="支付方式" name="payment" initialValue={null}>
                <Select
                  defaultValue="支付方式"
                  style={{ width: 100 }}
                >
                  <Option key={1} value={null}>全部方式</Option>
                  <Option value="Alipay">支付宝</Option>
                  <Option value="WeChatPay">微信支付</Option>
                  <Option value="CMB">招商银行</Option>
                </Select>
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
            },
            {
              title: '商品名',
              dataIndex: 'goods_name',
              key: 'goods_name',
              width: 75,
              align: 'center',
            },{
              title: '商品Id',
              dataIndex: 'goods_id',
              key: 'goods_id',
              width: 75,
              align: 'center',
            }, {
              title: '数量',
              dataIndex: 'goods_num',
              key: 'goods_num',
              width: 50,
              align: 'center',
            }, {
              title: '用户',
              dataIndex: 'username',
              key: 'username',
              width: 75,
              align: 'center',
            }, {
              title: '联系电话',
              dataIndex: 'user_phone',
              key: 'user_phone',
              width: 75,
              align: 'center',

            }, {
              title: '收货地址 ',
              dataIndex: 'user_address',
              key: 'user_address',
              width: 150,
              align: 'center',
            }, {
              title: '支付方式 ',
              dataIndex: 'payment',
              key: 'payment',
              width: 50,
              align: 'center',
            }, {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              width: 75,
              render: create_time => moment(create_time).format('YYYY-MM-DD HH:mm:ss'),
              align: 'center',
            }, {
              title: '修改时间',
              dataIndex: 'update_time',
              key: 'update_time',
              width: 75,
              render: update_time => update_time ? moment(update_time).format('YYYY-MM-DD HH:mm:ss') : '暂无',
              align: 'center',
            }, {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 75,
              align: 'center',
              render: status => (status === 0 ? '待发货' : status === 1 ? '待收货' : '待评价')
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
