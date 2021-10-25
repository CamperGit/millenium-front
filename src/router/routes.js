
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/LoginPage') },
      { path: 'signup', component: () => import('pages/SignupPage') }
    ]
  },
  {
    path: '/team',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('pages/CreateTeamPage') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
