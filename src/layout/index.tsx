import React from 'react';
import { Layout, Menu, Dropdown,Modal, message } from 'antd';
import './index.less';
import portrait from '@/assets/portrait.png';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BookOutlined,
  CopyOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

import { Link } from 'umi';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default class Index extends React.Component {
  state = {
    collapsed: false,
    logoutVisible: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

	logoutOk = () => {
    message.success('退出成功！')
    setTimeout(() => {
      window.location.href='./login'
    },500)

  };
  logoutCancel = () => {
    this.setState({
      logoutVisible: !this.state.logoutVisible,
    });
  };
  logout = () => {
    this.setState({
      logoutVisible: !this.state.logoutVisible,
    });
  }

  render() {
    return (
      <Layout>
        <Sider
          className="side"
          width={244}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo">酷物&nbsp; 后台管理系统</div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            <SubMenu key="1" icon={<UserOutlined />} title="用户管理">
              <Menu.Item key="2" icon={<UserOutlined />}>
                <Link to="/User">用户管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="3" icon={<ShoppingOutlined />} title="商品管理">
              <Menu.Item key="4" icon={<ShoppingOutlined />}>
                <Link to="/Products">商品管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="5" icon={<CopyOutlined />} title="订单管理">
              <Menu.Item key="6" icon={<CopyOutlined />}>
                <Link to="/Order">订单管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="7" icon={<BookOutlined />} title="留言管理">
              <Menu.Item key="8" icon={<BookOutlined />}>
                <Link to="/Message">留言管理</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: this.toggle,
              },
            )}

            <div className="mainAuth">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                      个人信息
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                      <Link to="/admin/changePassword/index">修改密码</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />} onClick={this.logout}>
                      退出登录
                    </Menu.Item>
                  </Menu>
                }
              >
                <a>
                  <img alt="管理员" src={portrait} />
                  <span style={{ color: '#000' }}>超级管理员，您好！</span>
                </a>
              </Dropdown>
            </div>
            <Modal
              title="提示"
              visible={this.state.logoutVisible}
              onOk={this.logoutOk}
              onCancel={this.logoutCancel}
              cancelText="取消"
              okText="确定"
            >
              <p>确定退出吗？</p>
            </Modal>
          </Header>

          <Content
            className="site-layout-background"
            style={{
              margin: '24px 0 0 24px',
              padding: 24,
              minHeight: 280,
              minWidth: 1300,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
