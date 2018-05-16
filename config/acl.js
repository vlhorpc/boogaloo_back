const acl = [
  {
    type: 1,
    role: 'admin',
    allows: [
      { resource: 'sign', methods: ['*'] },
      { resource: 'users', methods: ['*'] },
      { resource: 'dishes', methods: ['*'] }
    ]
  },
  {
    type: 2,
    role: 'user',
    allows: [
      { resource: 'sign', methods: ['*'] },
      { resource: 'users', methods: ['GET'] }
    ]
  },
  {
    type: 3,
    role: 'guest',
    allows: [
      { resource: 'sign', methods: ['GET', 'POST'] },
      { resource: 'users', methods: ['*'] },
      { resource: 'users_friends', methods: ['*'] },
    ]
  }
];

module.exports = acl;
