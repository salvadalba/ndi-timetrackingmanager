const { mapNameToUserId } = require('../lib/presence');

describe('mapNameToUserId', () => {
  test('returns matching id or null', () => {
    const map = new Map();
    map.set('user1', { name: 'John Doe' });
    map.set('user2', { name: 'Sarah Wilson' });

    expect(mapNameToUserId(map, 'Sarah Wilson')).toBe('user2');
    expect(mapNameToUserId(map, 'Unknown')).toBeNull();
  });
});
