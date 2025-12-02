export default [
  {
    path: '/',
    component: '@/layouts/GlobalLayout',
    routes: [
      { path: '/', component: './Guide' },
      { path: '/cube', component: './Cube' },
      { path: '/cube-r3f', component: './Cube/r3f' },
    ],
  },
];
