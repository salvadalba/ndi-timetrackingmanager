const { getListIdForStatus } = require('../lib/columns');

describe('getListIdForStatus', () => {
  test('maps known statuses to list ids', () => {
    expect(getListIdForStatus('todo')).toBe('todoTasks');
    expect(getListIdForStatus('inprogress')).toBe('inProgressTasks');
    expect(getListIdForStatus('REVIEW')).toBe('reviewTasks');
  });

  test('falls back to <status>Tasks', () => {
    expect(getListIdForStatus('custom')).toBe('customTasks');
  });
});
