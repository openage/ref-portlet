const link = {
  code: 'master',
  title: 'Master',
  icon: { fa: 'database' },
  routerLink: ['/master', 'dashboard'],
  permissions: ['organization.admin'],
  items: [{
    code: 'master.employees',
    title: 'Employees',
    icon: { fa: 'users' },
    routerLink: ['/master', 'employees']
  }]
};

const permissions = [{
  code: 'organization.employee.edit',
  name: 'Employee Edit',
  group: 'master.employee',
  description: 'Can edit employee'
}];

const permissionGroups = [{
  code: 'master.employee',
  name: 'Manage Employee',
  description: 'Employee Management'
}];

export { link, permissions, permissionGroups };
