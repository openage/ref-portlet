const link = {
  code: 'home',
  title: 'Home',
  icon: { fa: 'home' },
  routerLink: ['/home', 'dashboard'],
  permissions: ['user'],
  items: [{
    code: 'home.tasks',
    title: 'Tasks',
    icon: { fa: 'list' },
    routerLink: ['/home', 'tasks']
  }]
};

const permissions = [{
  code: 'organization.user',
  name: 'Organization User',
  group: 'user',
  description: 'An organization level role'
}];

const permissionGroups = [{
  code: 'user',
  name: 'User',
  description: 'Manage Self'
}];

export { link, permissions, permissionGroups };
