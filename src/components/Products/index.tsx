import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Table, Form,Popconfirm, Tooltip, message, Modal} from 'antd';
import styles from './index.less';
import request from '@/http';
import moment from 'moment';
import qs from 'qs';
import { OperateModal, UserEditObject } from './OperateModal';

const Products = () => {


  const [formObject] = Form.useForm();
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    total: 10,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [ '10', '20', '50'],
    showQuickJumper: true,
  });

  const [currentEditObject, setCurrentEditObject] =
    React.useState<UserEditObject>({
      isModalVisible: false,
    });

  const loadDataSource = async (
    userParams: any,
    pageCurrent: any,
    pageSize: any,
  ) => {
    console.log('userParams',userParams)
    const ds = {
      ...userParams,
      goods_id: userParams ? parseInt(userParams.goods_id) : null,
      current: pageCurrent,
      size: pageSize,
    };
    const {data}: any = await request.post('api/manageGoods',qs.stringify(ds))
    console.log('result',data)
    if(data.status === 200) {
      const newData: any = data.data.map((user:any) => ({
        key: `user_${user.goods_id}`,
        goods_id: user.goods_id,
        goods_name: user.goods_name,
        goods_img: user.goods_img,
        goods_desc: user.goods_desc,
        goods_number: user.goods_number,
        quality: user.quality,
        new_price: user.new_price,
        old_price: user.old_price,
        create_time: user.create_time,
        username: user.username,
        browse_num: user.browse_num,
        status:user.status
      }))
      const newPageObject = {
        ...pagination,
        current: pageCurrent,
        pageSize,
        total: newData.total
      }
      setDataSource(newData)
      setPagination(newPageObject)
    }

  };

  const searchOnClick = async () => {
    const data = formObject.getFieldsValue()


    await loadDataSource(data, 1, pagination.pageSize);
  };

  useEffect(() => {
    loadDataSource(null, 1, pagination.pageSize).finally();
  }, []);


  const pageOnChange = async (page: any) => {
    await loadDataSource(formObject.getFieldsValue(), page.current, page.pageSize);
  };

  const delGoods = async (goods_id: number) => {
    const {data}: any = await request.post('/api/manageDeleteGoods', {goods_id})
    if (data.status === 200) {
      setTimeout(() => {
        loadDataSource(null, 1, pagination.pageSize);
        message.success(data.msg);
      }, 500);
    }
  }

  const checkGoods = async (goods_id: number) => {
    const {data}: any = await request.post('/api/manageCheckGoods', {goods_id})
    if (data.status === 200) {
      setTimeout(() => {
        loadDataSource(null, 1, pagination.pageSize);
        message.success('????????????');
      }, 500);
    }
  }
  const removeGoods = async (goods_id: number) => {
    const {data}: any = await request.post('/api/manageRemoveGoods', {goods_id})
    if (data.status === 200) {
      setTimeout(() => {
        loadDataSource(null, 1, pagination.pageSize);
        message.success('????????????');
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
                <Form.Item label="?????? ID" name="goods_id" initialValue="">
                  <Input placeholder="?????????..."/>
                </Form.Item>
                <Form.Item label="??????" name="quality" initialValue="">
                   <Input placeholder="?????????..."/>
                </Form.Item>
                <Form.Item label="?????????" name="username">
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
        <div className={styles.mainTable}>
          <Table
            columns={[
              {
                title: 'ID',
                dataIndex: 'goods_id',
                key: 'goods_id',
                width: 40,
                align: 'center',
                render: v => (<span>{parseInt(v)}</span>)
              },
              {
                title: '?????????',
                dataIndex: 'goods_name',
                key: 'goods_name',
                width: 75,
                align: 'center',
                ellipsis: {
                  showTitle: false,
                },
                render: (goods_name:any) => (
                  <Tooltip placement="topLeft" title={goods_name} color="#108ee9">
                    {goods_name}
                  </Tooltip>
                ),
              },
              {
                title: '??????',
                dataIndex: 'goods_img',
                key: 'goods_img',
                width: 75,
                align: 'center',
                render: v => (<div><img src={v} style={{width:70,height:70}}/></div>)
              },
              {
                title: '??????',
                dataIndex: 'goods_number',
                key: 'goods_number',
                width: 40,
                align: 'center',

              },
              {
                title: '???????????? ',
                dataIndex: 'goods_desc',
                key: 'goods_desc',
                width: 75,
                align: 'center',
                ellipsis: {
                  showTitle: false,
                },
                render: (goods_desc:any) => (
                  <Tooltip placement="topLeft" title={goods_desc} color="#108ee9">
                    {goods_desc}
                  </Tooltip>
                ),
              },
              {
                title: '?????? ',
                dataIndex: 'quality',
                key: 'quality',
                width: 40,
                align: 'center',
              },
              {
                title: '?????????',
                dataIndex: 'new_price',
                key: 'new_price',
                width: 50,
                align: 'center',

              },
              {
                title: '?????????',
                dataIndex: 'old_price',
                key: 'old_price',
                width: 50,
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
                title: '????????????',
                dataIndex: 'create_time',
                key: 'create_time',
                width: 55,
                align: 'center',
                render: v => <div>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</div>
              },
              {
                title: '?????????',
                dataIndex: 'browse_num',
                key: 'browse_num',
                width: 50,
                align: 'center',

              },
              {
                title: '??????',
                dataIndex: 'status',
                key: 'status',
                width: 40,
                align: 'center',
                render: status => (status ? '?????????' : '?????????'),
              },
              {
                title: '??????',
                key: 'operate',
                align: 'center',
                width: 120,
                render: (row: any) => (
                  <>
                  <Popconfirm
                    title="?????????????????????????"
                     onConfirm={() => {
                      delGoods(row.goods_id)
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
                      ??????
                    </Button>
                    {row.status ?
                    <Popconfirm
                    title="??????????????????????"
                     onConfirm={() => {
                      removeGoods(row.goods_id)
                     }}
                    okText="??????"
                    cancelText="??????"
                  >
                     <Button type="link">
                      ??????
                    </Button>
                  </Popconfirm>
                    :
                    <Popconfirm
                    title="????????????????????????????"
                     onConfirm={() => {
                      checkGoods(row.goods_id)
                     }}
                    okText="??????"
                    cancelText="??????"
                  >
                     <Button type="link">
                      ??????
                    </Button>
                  </Popconfirm>
                    }

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
  )
}

export default Products;
