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
          { path: '/vertice', component: './Vertice' },
          { path: '/vertice-r3f', component: './Vertice/r3f' },
          { path: '/model', component: './Model' },
          { path: '/model-r3f', component: './Model/r3f' },
          { path: '/topography', component: './Topography' },
          { path: '/topography-r3f', component: './Topography/r3f' },
          { path: '/material-texture', component: './MaterialTexture' },
          { path: '/material-texture-r3f', component: './MaterialTexture/r3f' },
          { path: '/uv', component: './Uv' },
          { path: '/uv-r3f', component: './Uv/r3f' },
          { path: '/curve', component: './Curve' },
          { path: '/curve-r3f', component: './Curve/r3f' },
        ],
      },
    ],
  },
];
