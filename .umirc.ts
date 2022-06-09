import { defineConfig } from 'umi';
import routes from './src/components/routes';

const serverUrlRoot = 'http://localhost:8888';


export default defineConfig({
  define: {
    serverUrlRoot,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  base: '/',
  publicPath: '/',
  inlineLimit: 10,
  history: { type: 'browser'},
  routes,
  fastRefresh: {},
  proxy: {
    '/service': {
      target: serverUrlRoot,
      changeOrigin: true,
      pathRewrite: { '^/service': ''},
    }
  }
});
