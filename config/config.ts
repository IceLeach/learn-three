import { defineConfig } from 'umi';
import dotenv from 'dotenv';
import routes from './routes';

// 环境变量
const { NODE_ENV, REACT_APP_ENV } = process.env;

const envConfig = dotenv.config({
  path: `.env.${REACT_APP_ENV}`,
}).parsed ?? {};

// 路由前缀/public根目录
const ROUTE_BASE = envConfig.ROUTE_BASE ?? '/';

export default defineConfig({
  hash: true,
  title: false,
  routes,
  define: {
    NODE_ENV,
    REACT_APP_ENV,
    ROUTE_BASE,
  },
  exportStatic: {},
  base: ROUTE_BASE,
  publicPath: ROUTE_BASE,
  plugins: [
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
  initialState: {
    loading: '@/components/PageLoading',
  },
  model: {},
  favicons: [`${ROUTE_BASE}favicon.png`],
  npmClient: 'yarn',
});
