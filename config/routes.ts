export default [
  {
    path: '/',
    component: '@/layouts/GlobalLayout',
    routes: [
      { path: '/', component: './Guide' },
      {
        path: '/',
        component: '@/layouts/ExampleLayout',
        routes: [
          { path: '/cube', component: './Cube' },
          { path: '/cube-r3f', component: './Cube/r3f' },
          { path: '/frustum', component: './Frustum' },
          { path: '/frustum-r3f', component: './Frustum/r3f' },
        ],
      },
    ],
  },
];
