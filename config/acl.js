const acl = [
  {
    type: 1,
    role: 'admin',
    allows: [
      { resource: 'sign', methods: ['*'] },
      { resource: 'users', methods: ['*'] },
      { resource: 'dishes', methods: ['*'] },
      { resource: 'search', methods: ['*'] },
      { resource: 'chats', methods: ['*'] },
      { resource: 'chats', methods: ['*'] },
      { resource: 'chats_messages', methods: ['*'] },
      { resource: 'users_online', methods: ['*'] },
      { resource: 'users_not_read_messages', methods: ['*'] },
      { resource: 'chats_users', methods: ['*'] }
    ]
  },
  {
    type: 2,
    role: 'user',
    allows: [
      { resource: 'sign', methods: ['*'] },
      { resource: 'users', methods: ['GET'] },
      { resource: 'search', methods: ['*'] },
      { resource: 'users_friends', methods: ['*'] },
      { resource: 'chats', methods: ['*'] },
      { resource: 'chats_messages', methods: ['*'] },
      { resource: 'users_online', methods: ['*'] },
      { resource: 'users_not_read_messages', methods: ['*'] },
      { resource: 'chats_users', methods: ['*'] }
    ]
  },
  {
    type: 3,
    role: 'guest',
    allows: [
      { resource: 'sign', methods: ['GET', 'POST'] },
      { resource: 'users', methods: ['*'] },
      { resource: 'users_friends', methods: ['*'] },
      { resource: 'search', methods: ['*'] },
      { resource: 'chats', methods: ['GET'] },
      { resource: 'chats_messages', methods: ['*'] },
      { resource: 'users_online', methods: ['*'] }
    ]
  }
];

module.exports = acl;
