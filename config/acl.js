const acl = [
  {
    type: 1,
    role: 'admin',
    allows: [
      { resource: 'users', methods: ['*'] },
      { resource: 'sign', methods: ['*'] },
      { resource: 'dishes', methods: ['PUT'] },
      { resource: '/', methods: ['*'] }
    ]
  },
  {
    type: 2,
    role: 'user',
    allows: [
      { resource: 'sign', methods: ['GET'] },
      { resource: 'dishes', methods: ['GET'] },
      { resource: '/', methods: ['*'] }
    ]
  }
];

module.exports = acl;
