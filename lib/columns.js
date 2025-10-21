// Column mapping helper

const columnMap = {
  todo: 'todoTasks',
  inprogress: 'inProgressTasks',
  review: 'reviewTasks',
  done: 'doneTasks',
};

function getListIdForStatus(status) {
  return columnMap[(status || '').toLowerCase()] || `${(status || '').toLowerCase()}Tasks`;
}

module.exports = { getListIdForStatus };
