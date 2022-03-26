import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Table, Form,Popconfirm, Select, message, Modal} from 'antd';
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
                dataIndex: 'goods_id',
                key: 'goods_id',
                width: 75,
                align: 'center',
              },
              {
                title: '商品名',
                dataIndex: 'goods_name',
                key: 'goods_name',
                width: 100,
                align: 'center',
              },
              {
                title: '图片',
                dataIndex: 'goods_img',
                key: 'goods_img',
                width: 75,
                align: 'center',
                render: v => (<div><img src={v} style={{width:70,height:70}}/></div>)
              },
              {
                title: '数量',
                dataIndex: 'goods_number',
                key: 'goods_number',
                width: 75,
                align: 'center',

              },
              {
                title: '商品描述 ',
                dataIndex: 'goods_desc',
                key: 'goods_desc',
                width: 75,
                align: 'center',
              },
              {
                title: '成色 ',
                dataIndex: 'quality',
                key: 'quality',
                width: 75,
                align: 'center',
              },
              {
                title: '新价格',
                dataIndex: 'new_price',
                key: 'new_price',
                width: 75,
                align: 'center',

              },
              {
                title: '旧价格',
                dataIndex: 'old_price',
                key: 'old_price',
                width: 75,
                align: 'center',

              },
              {
                title: '发布人',
                dataIndex: 'username',
                key: 'username',
                width: 75,
                align: 'center',

              },
              {
                title: '发布时间',
                dataIndex: 'create_time',
                key: 'create_time',
                width: 75,
                align: 'center',
                render: v => <div>{moment(v).format('YYYY-MM-DD HH:mm:ss')}</div>
              },
              {
                title: '浏览量',
                dataIndex: 'browse_num',
                key: 'browse_num',
                width: 75,
                align: 'center',

              },
              {
                title: '旧价格',
                key: 'old_price',
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
  )
}

export default Products;
