export const routes = [
    {
      path: '/',
      redirect:{name: 'chat-app'},
      children: [
        {
          name: 'chat-app',
          path: 'chat-app',
          component: () => import('@views/chat-app.vue'),
        },
        {
            name: 'tree-traverse',
            path: 'tree-traverse',
            component: () => import('@views/tree-traverse.vue'),
          },
    ]
    }
]