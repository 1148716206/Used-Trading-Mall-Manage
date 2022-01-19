import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Table, Form,Popconfirm, Select, message, Modal} from 'antd';
import styles from './index.less';
import request from '@/http';
import qs from 'qs';
import { OperateModal, UserEditObject } from './OperateModal';

const UserInfo = () => {

  const [formObject] = Form.useForm();
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    total: 10,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    showQuickJumper: true,
  });

  const [currentEditObject, setCurrentEditObject] =
    React.useState<UserEditObject>({
      isModalVisible: false,
      modalType: 'add',
    });

  const loadDataSource = async (
    userParams: any,
    pageCurrent: any,
    pageSize: any,
  ) => {
    console.log('userParams',userParams)
    const ds = {
      ...userParams,
      current: pageCurrent,
      size: pageSize,
    };
    const result: any = await request.post('api/getUserInfo',qs.stringify(ds))
    console.log('result',result)
    if(result && result.data.code === 200) {



      const data: any = result.data.data.map((user:any) => ({
        key: `user_${user.id}`,
        id: user.id,
        username: user.username,
        gender: user.gender,
        address: user.address,
        phone: user.phone,
        permission: user.permission
      }))
      const newPageObject = {
        ...pagination,
        current: pageCurrent,
        pageSize,
        total: result.data.total
      }
      setDataSource(data)
      setPagination(newPageObject)
    }

  };

  const searchOnClick = async () => {
    const data = formObject.getFieldsValue()
    let dataStr = ''
    let ds = {
      ...data
    }
    for (var i in ds) {
      if (dataStr !== '') dataStr += '&'
      dataStr += encodeURIComponent(i) + '=' + encodeURIComponent(ds[i])
    }

    await loadDataSource(ds, 1, pagination.pageSize);
  };

  useEffect(() => {
    loadDataSource(null, 1, pagination.pageSize).finally();
  }, []);


  const pageOnChange = async (page: any) => {
    await loadDataSource(formObject.getFieldsValue(), page.current, page.pageSize);
  };

  const delUser = async (id: number) => {
    const result: any = await request.post('/api/updateUserInfo?id=', {id})
  }



//重置按钮
  const resetOnClick = () => {
    formObject.resetFields()
  };


  async function userEditOnClose() {
    await loadDataSource(
      formObject.getFieldsValue(),
      pagination.current,
      pagination.pageSize,
    );
  }

  return (
    <div className={styles.pageContent}>
        <div className={styles.search} >
          <div className={styles.search__form}>
            <Form layout='inline' form={formObject}>
              <Space>
                <Form.Item label="用户 ID" name="id" initialValue="">
                  <Input placeholder="请输入..."/>
                </Form.Item>
                <Form.Item label="用户名" name="username" initialValue="">
                   <Input placeholder="请输入..."/>
                </Form.Item>
                <Form.Item label="联系电话" name="phone">
                  <Input placeholder="请输入..."/>
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
        <div className={styles.add_button}>
          <Button
            type="primary"
            onClick={() => {
              setCurrentEditObject({
                isModalVisible: true,
                modalType: 'add'
              })
            }}
          >
            新增用户
          </Button>
        </div>
        <div className={styles.mainTable}>
          <Table
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 75,
                align: 'center',
              },
              {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                width: 100,
                align: 'center',
              },
              {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                width: 75,
                render: status => (status ? '男' : '女'),
                align: 'center',
              },
              {
                title: '联系电话',
                dataIndex: 'phone',
                key: 'phone',
                width: 75,
                align: 'center',

              },
              {
                title: '收货地址 ',
                dataIndex: 'address',
                key: 'address',
                width: 75,
                align: 'center',
              },
              {
                title: '权限等级',
                dataIndex: 'permission',
                key: 'permission',
                width: 75,
                align: 'center',
                render: permission => (permission === 0 ? '用户' : permission === 1 ? '管理员' : '超级管理员')
              },
              {
                title: '操作',
                key: 'action',
                align: 'center',
                width: 75,
                render: (row: any) => (
                  <>
                  <Popconfirm
                    title="确定删除该用户吗?"
                     onConfirm={() => {
                       delUser(row.id)
                     }}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button type="link">
                      删除
                    </Button>
                  </Popconfirm>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentEditObject({
                          ...row,
                          isModalVisible: true
                        })
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

      <OperateModal
        editObject={currentEditObject}
        onClose={userEditOnClose}
      />

      </div>
  );
};

export default UserInfo;

