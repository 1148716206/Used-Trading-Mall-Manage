import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Table, Form,Popconfirm, Tooltip} from 'antd';
import styles from './index.less';
import request from '@/http';
import moment from 'moment';
import qs from 'qs';

const Message = () => {

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
    const {data}: any = await request.post('/api/manageMessage',qs.stringify(ds))
    console.log('result',data)
    if(data.status === 200) {



      const newData: any = data.data.map((msgData:any) => ({
        key: `user_${msgData.id}`,
        goods_id: msgData.goods_id,
        username: msgData.username,
        content: msgData.content,
        create_time: msgData.create_time,

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
                <Form.Item label="商品 ID" name="goods_id" initialValue="">
                  <Input placeholder="请输入..."/>
                </Form.Item>
                <Form.Item label="留言" name="content" initialValue="">
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

        <div className={styles.mainTable}>
          <Table
            columns={[
              {
                title: '商品ID',
                dataIndex: 'goods_id',
                key: 'goods_id',
                width: 30,
                align: 'center',
              },
              {
                title: '留言',
                dataIndex: 'content',
                key: 'content',
                width: 150,
                align: 'center',
                ellipsis: {
                  showTitle: false,
                },
                render: (content:any) => (
                  <Tooltip placement="topLeft" title={content} color="#108ee9">
                    {content}
                  </Tooltip>
                ),
              },
              {
                title: '发布人',
                dataIndex: 'username',
                key: 'username',
                width: 50,
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
                title: '操作',
                key: 'operate',
                align: 'center',
                width: 50,
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


      </div>
  )
}

export default Message;

