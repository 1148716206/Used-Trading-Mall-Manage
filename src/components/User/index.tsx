import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Table, Form,Popconfirm, Tooltip, message, Modal} from 'antd';
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
    pageSizeOptions: ['10', '20', '50'],
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
    const {data}: any = await request.post('api/manageUser',qs.stringify(ds))
    console.log('data',data)
    if(data && data.status === 200) {
      const newData: any = data.data.map((user:any) => ({
        key: `user_${user.id}`,
        id: user.id,
        nickname: user.nickname,
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
        total: data.total
      }
      setDataSource(newData)
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
    const {data}: any = await request.post('/api/manageDeleteUser', {id})
    if(data.status === 200) {
      setTimeout(() => {
        message.success('????????????')
      }, 500);

    } else {
      setTimeout(() => {
        message.error('????????????')
      }, 500);
    }
  }



//????????????
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
                <Form.Item label="?????? ID" name="id" initialValue="">
                  <Input placeholder="?????????..."/>
                </Form.Item>
                <Form.Item label="?????????" name="username" initialValue="">
                   <Input placeholder="?????????..."/>
                </Form.Item>
                <Form.Item label="????????????" name="phone">
                  <Input placeholder="?????????..."/>
                </Form.Item>
                <Button
                  type="primary"
                  onClick={searchOnClick}
                >
                  ??????
                </Button>
                <Button onClick={resetOnClick}>??????</Button>
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
            ????????????
          </Button>
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
                title: '??????',
                dataIndex: 'nickname',
                key: 'nickname',
                width: 75,
                align: 'center',
              },
              {
                title: '?????????',
                dataIndex: 'username',
                key: 'username',
                width: 75,
                align: 'center',
              },
              {
                title: '??????',
                dataIndex: 'gender',
                key: 'gender',
                width: 40,
                render: status => (status ? '???' : '???'),
                align: 'center',
              },
              {
                title: '????????????',
                dataIndex: 'phone',
                key: 'phone',
                width: 100,
                align: 'center',

              },
              {
                title: '???????????? ',
                dataIndex: 'address',
                key: 'address',
                width: 150,
                align: 'center',
                ellipsis: {
                  showTitle: false,
                },
                render: (address:any) => (
                  <Tooltip placement="topLeft" title={address} color="#108ee9">
                    {address}
                  </Tooltip>
                ),
              },
              {
                title: '????????????',
                dataIndex: 'permission',
                key: 'permission',
                width: 50,
                align: 'center',
                render: permission => (permission === 0 ? '????????????' : permission === 1 ? '?????????' : '???????????????')
              },
              {
                title: '??????',
                key: 'action',
                align: 'center',
                width: 100,
                render: (row: any) => (
                  <>
                  <Popconfirm
                    title="?????????????????????????"
                     onConfirm={() => {
                       delUser(row.id)
                     }}
                    okText="??????"
                    cancelText="??????"
                  >
                    <Button type="link">
                      ??????
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
                      ????????????
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

