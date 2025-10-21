// Presence mapping helper

function mapNameToUserId(activeUsersMap, name) {
  for (const [id, user] of activeUsersMap.entries()) {
    if (user.name === name) return id;
  }
  return null;
}

module.exports = { mapNameToUserId };
