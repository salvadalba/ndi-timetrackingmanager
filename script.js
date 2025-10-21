// Time Tracking Manager - Collaborative Task Manager JavaScript

class TimeTrackingManager {
  constructor() {
    this.currentUser = {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://picsum.photos/seed/user1/40/40.jpg',
    };

    this.activeUsers = new Map();
    this.tasks = new Map();
    this.activities = [];
    this.timerInterval = null;
    this.currentTimeEntry = null;
    this.wsConnection = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInitialData();
    this.initWebSocket();
    this.startRealTimeUpdates();
    this.initializeDragAndDrop();
  }

  setupEventListeners() {
    // Header actions
    document.getElementById('addTaskBtn').addEventListener('click', () => this.showAddTaskModal());
    document.getElementById('filterBtn').addEventListener('click', () => this.showFilterModal());

    // Activity feed toggle
    document
      .getElementById('feedToggle')
      .addEventListener('click', () => this.toggleActivityFeed());

    // Time tracking
    document
      .getElementById('timeTrackingFab')
      .addEventListener('click', () => this.showTimeTrackingModal());
    document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
    document.getElementById('pauseTimer').addEventListener('click', () => this.pauseTimer());
    document.getElementById('stopTimer').addEventListener('click', () => this.stopTimer());
    document
      .getElementById('closeTimeModal')
      .addEventListener('click', () => this.closeModal('timeTrackingModal'));

    // File attachments
    document.getElementById('attachmentFab').addEventListener('click', () => this.showFileModal());
    document
      .getElementById('closeFileModal')
      .addEventListener('click', () => this.closeModal('fileModal'));
    document.getElementById('uploadZone').addEventListener('click', () => this.triggerFileInput());
    document.getElementById('fileInput').addEventListener('change', e => this.handleFileUpload(e));

    // Project switching
    document.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', () => this.switchProject(item.dataset.project));
    });

    // Task interactions
    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', e => this.handleTaskClick(card, e));
      card.addEventListener('dragstart', e => this.handleDragStart(e, card));
      card.addEventListener('dragend', e => this.handleDragEnd(e, card));
    });

    // Task column interactions
    document.querySelectorAll('.task-list').forEach(list => {
      list.addEventListener('dragover', e => this.handleDragOver(e));
      list.addEventListener('drop', e => this.handleDrop(e, list));
    });

    // Modal overlays
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  // WebSocket and Real-time Collaboration
  initWebSocket() {
    // Simulate WebSocket connection for demo purposes
    // In production, this would connect to a real WebSocket server
    this.simulateWebSocket();
  }

  simulateWebSocket() {
    // Simulate connection
    setTimeout(() => {
      this.addActivityItem('system', 'Connected to real-time collaboration server');
      this.simulateOtherUsers();
    }, 1000);

    // Simulate periodic updates
    setInterval(() => {
      this.simulateRealtimeActivity();
    }, 15000);
  }

  simulateOtherUsers() {
    const otherUsers = [
      {
        id: 'user2',
        name: 'Sarah Wilson',
        avatar: 'https://picsum.photos/seed/user2/32/32.jpg',
        status: 'online',
        currentTask: 'Navigation Component',
      },
      {
        id: 'user3',
        name: 'Mike Chen',
        avatar: 'https://picsum.photos/seed/user3/32/32.jpg',
        status: 'online',
        currentTask: 'Database Schema',
      },
      {
        id: 'user4',
        name: 'Emily Davis',
        avatar: 'https://picsum.photos/seed/user4/32/32.jpg',
        status: 'away',
        currentTask: null,
      },
    ];

    otherUsers.forEach(user => {
      this.activeUsers.set(user.id, user);
      this.updateUserPresence(user);
    });

    this.updateActiveUsersList();
  }

  simulateRealtimeActivity() {
    // Activities now include userId and displayName to keep presence updates consistent
    const activities = [
      {
        userId: 'user2',
        userName: 'Sarah Wilson',
        action: 'started working on',
        target: 'Navigation Component',
        type: 'task',
      },
      {
        userId: 'user3',
        userName: 'Mike Chen',
        action: 'commented on',
        target: 'Database Schema',
        type: 'comment',
      },
      {
        userId: 'user4',
        userName: 'Emily Davis',
        action: 'uploaded files to',
        target: 'API Documentation',
        type: 'file',
      },
      {
        userId: 'user2',
        userName: 'Sarah Wilson',
        action: 'completed',
        target: 'Header Component',
        type: 'complete',
      },
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    // For the activity feed show the display name
    this.addActivityItem(
      randomActivity.userName,
      `${randomActivity.action} ${randomActivity.target}`,
      randomActivity.type,
    );

    // Update task presence indicators using the userId for consistency
    if (randomActivity.type === 'task') {
      // updateTaskPresence now accepts taskTitle and either userName or userId
      this.updateTaskPresence(randomActivity.target, randomActivity.userId);
    }
  }

  startRealTimeUpdates() {
    // Update timestamps
    setInterval(() => {
      this.updateRelativeTimes();
    }, 60000);

    // Simulate user presence updates
    setInterval(() => {
      this.updateUserPresenceIndicators();
    }, 5000);
  }

  // Operational Transform for Collaborative Editing
  applyOperation(operation) {
    switch (operation.type) {
      case 'task-create':
        this.createTask(operation.data);
        break;
      case 'task-update':
        this.updateTask(operation.taskId, operation.data);
        break;
      case 'task-move':
        this.moveTask(operation.taskId, operation.fromColumn, operation.toColumn);
        break;
      case 'task-delete':
        this.deleteTask(operation.taskId);
        break;
      case 'comment-add':
        this.addComment(operation.taskId, operation.data);
        break;
      case 'file-attach':
        this.attachFile(operation.taskId, operation.data);
        break;
    }

    // Broadcast to other users
    this.broadcastOperation(operation);
  }

  broadcastOperation(operation) {
    // In production, this would send the operation through WebSocket
    console.log('Broadcasting operation:', operation);

    // Simulate receiving operation from other users
    setTimeout(() => {
      if (Math.random() > 0.7) {
        this.simulateRemoteOperation();
      }
    }, 2000);
  }

  simulateRemoteOperation() {
    const operations = [
      { type: 'task-update', taskId: '3', data: { progress: Math.floor(Math.random() * 100) } },
      {
        type: 'comment-add',
        taskId: '1',
        data: { user: 'Sarah Wilson', comment: 'Great progress on this!' },
      },
      { type: 'task-move', taskId: '2', fromColumn: 'todo', toColumn: 'inprogress' },
    ];

    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    this.applyOperation(randomOp);
  }

  // Task Management
  createTask(taskData) {
    const task = {
      id: this.generateId(),
      ...taskData,
      createdAt: new Date(),
      createdBy: this.currentUser.id,
    };

    this.tasks.set(task.id, task);
    this.renderTask(task);
    this.addActivityItem(this.currentUser.name, `created task "${task.title}"`, 'task');
  }

  updateTask(taskId, updates) {
    const task = this.tasks.get(taskId);
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date() });
      this.updateTaskCard(taskId, updates);

      if (updates.title) {
        this.addActivityItem(this.currentUser.name, `updated task "${updates.title}"`, 'update');
      }
    }
  }

  moveTask(taskId, fromColumn, toColumn) {
    const task = this.tasks.get(taskId);
    if (task) {
      // Normalize status to lowercase keys used throughout the app
      const normalizedTo = ('' + toColumn).toLowerCase();
      task.status = normalizedTo;
      task.updatedAt = new Date();

      const columnMap = {
        todo: 'todoTasks',
        inprogress: 'inProgressTasks',
        review: 'reviewTasks',
        done: 'doneTasks',
      };

      const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskCard) {
        const targetListId = columnMap[normalizedTo] || `${normalizedTo}Tasks`;
        const targetList = document.getElementById(targetListId);
        if (targetList) targetList.appendChild(taskCard);
      }

      this.addActivityItem(
        this.currentUser.name,
        `moved task to ${this.getColumnTitle(normalizedTo)}`,
        'move',
      );
    }
  }

  deleteTask(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      this.tasks.delete(taskId);
      const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskCard) {
        taskCard.remove();
      }

      this.addActivityItem(this.currentUser.name, `deleted task "${task.title}"`, 'delete');
    }
  }

  renderTask(task) {
    const columnMap = {
      todo: 'todoTasks',
      inprogress: 'inProgressTasks',
      review: 'reviewTasks',
      done: 'doneTasks',
    };

    const targetList = document.getElementById(columnMap[task.status]);
    if (targetList) {
      const taskCard = this.createTaskCard(task);
      targetList.appendChild(taskCard);
    }
  }

  createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.taskId = task.id;
    card.dataset.users = task.assignedUsers ? task.assignedUsers.join(',') : '';
    card.draggable = true;

    card.innerHTML = `
            <div class="task-header">
                <span class="task-priority ${task.priority || 'medium'}"></span>
                <h4>${task.title}</h4>
                <div class="task-actions">
                    <button class="task-menu"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
            <div class="task-description">${task.description || ''}</div>
            ${
              task.progress !== undefined
                ? `
                <div class="task-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                    </div>
                    <span class="progress-text">${task.progress}%</span>
                </div>
            `
                : ''
            }
            <div class="task-meta">
                <div class="task-users">
                    ${this.renderTaskUsers(task.assignedUsers || [])}
                </div>
                <div class="task-time">
                    <i class="fas fa-clock"></i>
                    <span>${task.estimatedTime || '0h 0m'}</span>
                </div>
            </div>
            ${
              task.attachments && task.attachments.length > 0
                ? `
                <div class="task-attachments">
                    <i class="fas fa-paperclip"></i>
                    <span>${task.attachments.length} files</span>
                </div>
            `
                : ''
            }
            <div class="presence-indicators">
                ${this.renderPresenceIndicators(task.id)}
            </div>
        `;

    // Add event listeners
    card.addEventListener('click', e => this.handleTaskClick(card, e));
    card.addEventListener('dragstart', e => this.handleDragStart(e, card));
    card.addEventListener('dragend', e => this.handleDragEnd(e, card));

    return card;
  }

  renderTaskUsers(users) {
    let html = '';
    users.slice(0, 3).forEach(userId => {
      const user = this.activeUsers.get(userId);
      if (user) {
        html += `<img src="${user.avatar}" alt="${user.name}">`;
      }
    });

    if (users.length > 3) {
      html += `<div class="user-count">+${users.length - 3}</div>`;
    }

    return html;
  }

  renderPresenceIndicators(taskId) {
    const activeUsersOnTask = this.getUsersOnTask(taskId);
    let html = '';

    activeUsersOnTask.forEach(user => {
      html += `
                <div class="presence-indicator active" data-user="${user.id}">
                    <img src="${user.avatar}" alt="${user.name}">
                    <span class="presence-tooltip">${user.name} is ${
        user.activity || 'viewing'
      }</span>
                </div>
            `;
    });

    return html;
  }

  // Drag and Drop
  initializeDragAndDrop() {
    // Already initialized in setupEventListeners
  }

  handleDragStart(e, card) {
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Use text/plain for task id which is widely supported
    try {
      e.dataTransfer.setData('text/plain', card.dataset.taskId);
    } catch (err) {
      e.dataTransfer.setData('taskId', card.dataset.taskId);
    }
    e.dataTransfer.setData('fromColumn', card.parentElement.id);
  }

  handleDragEnd(e, card) {
    card.classList.remove('dragging');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const draggingCard = document.querySelector('.dragging');
    const afterElement = this.getDragAfterElement(e.currentTarget, e.clientY);

    if (afterElement == null) {
      e.currentTarget.appendChild(draggingCard);
    } else {
      e.currentTarget.insertBefore(draggingCard, afterElement);
    }
  }

  handleDrop(e, list) {
    e.preventDefault();

    // Prefer text/plain for task id with fallback
    let taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) taskId = e.dataTransfer.getData('taskId');

    const fromColumnId = e.dataTransfer.getData('fromColumn');
    const toColumnId = list.id;

    const fromStatus = fromColumnId ? fromColumnId.replace('Tasks', '').toLowerCase() : '';
    const toStatus = toColumnId ? toColumnId.replace('Tasks', '').toLowerCase() : '';

    if (taskId && fromStatus !== toStatus) {
      this.moveTask(taskId, fromStatus, toStatus);
    }
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }

  // Time Tracking
  startTimer() {
    if (!this.currentTimeEntry) {
      this.currentTimeEntry = {
        taskId: '1', // Current selected task
        startTime: new Date(),
        duration: 0,
      };
    }

    this.currentTimeEntry.paused = false;

    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);

    this.showToast('Timer started', 'success');
    this.addActivityItem(this.currentUser.name, 'started time tracking', 'time');
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.currentTimeEntry) {
      this.currentTimeEntry.paused = true;
    }

    this.showToast('Timer paused', 'warning');
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.currentTimeEntry) {
      const endTime = new Date();
      const duration = Math.floor((endTime - this.currentTimeEntry.startTime) / 1000);

      this.saveTimeEntry({
        ...this.currentTimeEntry,
        endTime,
        duration,
      });

      this.currentTimeEntry = null;
    }

    this.showToast('Timer stopped', 'info');
    this.addActivityItem(this.currentUser.name, 'stopped time tracking', 'time');
  }

  updateTimerDisplay() {
    if (this.currentTimeEntry && !this.currentTimeEntry.paused) {
      const now = new Date();
      const elapsed = Math.floor((now - this.currentTimeEntry.startTime) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;

      const display = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      document.getElementById('timeDisplay').textContent = display;
    }
  }

  saveTimeEntry(entry) {
    // In production, this would save to a backend
    console.log('Saving time entry:', entry);

    // Add to time entries list
    const entryList = document.querySelector('.entry-list');
    if (entryList) {
      const entryElement = document.createElement('div');
      entryElement.className = 'time-entry';
      entryElement.innerHTML = `
                <div class="entry-task">Task #${entry.taskId}</div>
                <div class="entry-time">${this.formatDuration(entry.duration)}</div>
                <div class="entry-actions">
                    <button class="edit-entry"><i class="fas fa-edit"></i></button>
                </div>
            `;
      entryList.insertBefore(entryElement, entryList.firstChild);
    }
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // File Management
  triggerFileInput() {
    document.getElementById('fileInput').click();
  }

  handleFileUpload(event) {
    const files = event.target.files;

    Array.from(files).forEach(file => {
      this.uploadFile(file);
    });

    // Reset file input
    event.target.value = '';
  }

  uploadFile(file) {
    // Simulate file upload
    const fileData = {
      id: this.generateId(),
      name: file.name,
      size: this.formatFileSize(file.size),
      type: file.type,
      uploadedBy: this.currentUser.id,
      uploadedAt: new Date(),
    };

    // Add to file list
    const fileItems = document.querySelector('.file-items');
    if (fileItems) {
      const fileElement = this.createFileElement(fileData);
      fileItems.appendChild(fileElement);
    }

    this.addActivityItem(this.currentUser.name, `uploaded file "${file.name}"`, 'file');
    this.showToast(`File "${file.name}" uploaded successfully`, 'success');
  }

  createFileElement(fileData) {
    const element = document.createElement('div');
    element.className = 'file-item';

    const icon = this.getFileIcon(fileData.type);

    element.innerHTML = `
            <div class="file-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${fileData.name}</div>
                <div class="file-size">${fileData.size}</div>
            </div>
            <div class="file-actions">
                <button class="download-file"><i class="fas fa-download"></i></button>
                <button class="delete-file"><i class="fas fa-trash"></i></button>
            </div>
        `;

    // Add event listeners
    element
      .querySelector('.download-file')
      .addEventListener('click', () => this.downloadFile(fileData));
    element
      .querySelector('.delete-file')
      .addEventListener('click', () => this.deleteFile(fileData.id, element));

    return element;
  }

  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'file-image';
    if (fileType.startsWith('video/')) return 'file-video';
    if (fileType.startsWith('audio/')) return 'file-audio';
    if (fileType.includes('pdf')) return 'file-pdf';
    if (fileType.includes('word')) return 'file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'file-excel';
    if (fileType.includes('powerpoint') || fileType.includes('presentation'))
      return 'file-powerpoint';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'file-archive';
    return 'file';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadFile(fileData) {
    // Simulate file download
    this.showToast(`Downloading ${fileData.name}...`, 'info');
  }

  deleteFile(fileId, element) {
    element.remove();
    this.showToast('File deleted', 'info');
  }

  // Activity Feed
  addActivityItem(user, message, type = 'info') {
    const activity = {
      id: this.generateId(),
      user,
      message,
      type,
      timestamp: new Date(),
    };

    this.activities.unshift(activity);
    this.renderActivityItem(activity);
    this.broadcastActivity(activity);
  }

  renderActivityItem(activity) {
    const feedContent = document.getElementById('feedContent');
    if (feedContent) {
      const activityElement = document.createElement('div');
      activityElement.className = 'activity-item';

      const isFileActivity = activity.type === 'file';
      const isSystemActivity = activity.user === 'system';

      activityElement.innerHTML = `
                <div class="activity-icon ${isFileActivity ? 'file' : ''}">
                    ${
                      isSystemActivity
                        ? '<i class="fas fa-info-circle"></i>'
                        : isFileActivity
                        ? '<i class="fas fa-file"></i>'
                        : `<img src="https://picsum.photos/seed/${activity.user}/32/32.jpg" alt="${activity.user}">`
                    }
                </div>
                <div class="activity-details">
                    <div class="activity-text">
                        ${
                          isSystemActivity
                            ? activity.message
                            : `<strong>${activity.user}</strong> ${activity.message}`
                        }
                    </div>
                    <div class="activity-time">${this.formatRelativeTime(activity.timestamp)}</div>
                </div>
            `;

      feedContent.insertBefore(activityElement, feedContent.firstChild);

      // Keep only last 50 activities
      while (feedContent.children.length > 50) {
        feedContent.removeChild(feedContent.lastChild);
      }
    }
  }

  broadcastActivity(activity) {
    // In production, this would broadcast through WebSocket
    console.log('Broadcasting activity:', activity);
  }

  // User Presence
  updateUserPresence(user) {
    // Update team list
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
      const memberName = member.querySelector('.member-name')?.textContent;
      if (memberName === user.name) {
        member.className = `team-member ${user.status}`;

        const statusText = member.querySelector('.member-status');
        if (statusText) {
          if (user.currentTask) {
            statusText.textContent = `Working on ${user.currentTask}`;
          } else if (user.status === 'away') {
            statusText.textContent = 'Away - 5 min';
          } else {
            statusText.textContent = 'Online';
          }
        }
      }
    });

    // Update presence indicators on tasks
    this.updateTaskPresenceIndicators();
  }

  updateTaskPresence(taskTitle, userName) {
    // Try to map the provided userName to a known user id in activeUsers
    let userId = null;
    for (const [id, user] of this.activeUsers.entries()) {
      if (user.name === userName || user.name === `${userName}`) {
        userId = id;
        break;
      }
    }

    // Fallback: slugify the userName
    const fallbackId = userName.toLowerCase().replace(/\s+/g, '');
    const idToUse = userId || fallbackId;

    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('h4')?.textContent;
      if (title && title.includes(taskTitle)) {
        const presenceIndicators = card.querySelector('.presence-indicators');
        if (presenceIndicators) {
          const existingIndicator = presenceIndicators.querySelector(`[data-user="${idToUse}"]`);
          if (!existingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'presence-indicator active';
            indicator.dataset.user = idToUse;
            indicator.innerHTML = `
                            <img src="https://picsum.photos/seed/${userName}/20/20.jpg" alt="${userName}">
                            <span class="presence-tooltip">${userName} is editing</span>
                        `;
            presenceIndicators.appendChild(indicator);

            // Remove after 10 seconds
            setTimeout(() => {
              indicator.remove();
            }, 10000);
          }
        }
      }
    });
  }

  updateTaskPresenceIndicators() {
    document.querySelectorAll('.presence-indicator').forEach(indicator => {
      const user = this.activeUsers.get(indicator.dataset.user);
      if (user && user.status !== 'online') {
        indicator.classList.remove('active');
      }
    });
  }

  updateActiveUsersList() {
    const userAvatars = document.getElementById('userAvatars');
    if (userAvatars) {
      userAvatars.innerHTML = '';

      this.activeUsers.forEach(user => {
        if (user.status === 'online') {
          const avatar = document.createElement('img');
          avatar.src = user.avatar;
          avatar.alt = user.name;
          avatar.title = user.name;
          userAvatars.appendChild(avatar);
        }
      });
    }
  }

  getUsersOnTask(taskId) {
    // Simulate users currently viewing/editing a task
    const task = this.tasks.get(taskId);
    if (!task) return [];

    return Array.from(this.activeUsers.values()).filter(_user => {
      return Math.random() > 0.7; // Simulate random presence
    });
  }

  // UI Helpers
  showAddTaskModal() {
    // Implementation for add task modal
    this.showToast('Add task modal coming soon', 'info');
  }

  showFilterModal() {
    // Implementation for filter modal
    this.showToast('Filter functionality coming soon', 'info');
  }

  showTimeTrackingModal() {
    this.openModal('timeTrackingModal');
  }

  showFileModal() {
    this.openModal('fileModal');
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  toggleActivityFeed() {
    const feed = document.querySelector('.activity-feed');
    if (feed) {
      feed.classList.toggle('collapsed');
    }
  }

  handleTaskClick(card, event) {
    // Don't open modal if clicking on action buttons
    if (event.target.closest('.task-actions')) {
      return;
    }

    // Show task details modal or highlight card
    document.querySelectorAll('.task-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    this.showToast(`Selected: ${card.querySelector('h4').textContent}`, 'info');
  }

  switchProject(projectId) {
    document.querySelectorAll('.project-item').forEach(item => {
      item.classList.remove('active');
    });

    document.querySelector(`[data-project="${projectId}"]`).classList.add('active');

    this.showToast(`Switched to project ${projectId}`, 'info');
    this.addActivityItem(this.currentUser.name, `switched to project ${projectId}`, 'navigation');
  }

  // Utility Functions
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }

  formatRelativeTime(timestamp) {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  updateRelativeTimes() {
    document.querySelectorAll('.activity-time').forEach(element => {
      const time = element.dataset.timestamp;
      if (time) {
        element.textContent = this.formatRelativeTime(new Date(time));
      }
    });
  }

  getColumnTitle(columnId) {
    const titles = {
      todo: 'To Do',
      inprogress: 'In Progress',
      review: 'Review',
      done: 'Done',
    };
    return titles[columnId] || columnId;
  }

  showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Load initial data
  loadInitialData() {
    // Load initial tasks
    const initialTasks = [
      {
        id: '1',
        title: 'Design Homepage Layout',
        description: 'Create responsive design for the main homepage with modern UI elements',
        status: 'todo',
        priority: 'high',
        assignedUsers: ['user1', 'user2'],
        estimatedTime: '2h 30m',
        attachments: 3,
      },
      {
        id: '2',
        title: 'Setup Development Environment',
        description: 'Configure webpack, babel, and other build tools',
        status: 'todo',
        priority: 'medium',
        assignedUsers: ['user3'],
        estimatedTime: '1h 15m',
      },
      {
        id: '3',
        title: 'Implement Navigation Component',
        description: 'Build reusable navigation component with dropdown menus',
        status: 'inprogress',
        priority: 'high',
        assignedUsers: ['user2', 'user4'],
        estimatedTime: '4h 45m',
        progress: 65,
      },
      {
        id: '4',
        title: 'Database Schema Design',
        description: 'Finalize database schema for user management system',
        status: 'review',
        priority: 'low',
        assignedUsers: ['user1'],
        estimatedTime: '3h 20m',
      },
      {
        id: '5',
        title: 'Setup Git Repository',
        description: 'Initialize git repo with proper branching strategy',
        status: 'done',
        priority: 'medium',
        assignedUsers: ['user3'],
        estimatedTime: '0h 45m',
      },
    ];

    initialTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });

    // Load initial activities
    const initialActivities = [
      {
        user: 'Sarah Wilson',
        message: 'started working on Navigation Component',
        type: 'task',
        timestamp: new Date(Date.now() - 120000),
      },
      {
        user: 'John Doe',
        message: 'added a comment to Homepage Layout',
        type: 'comment',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        user: 'Mike Chen',
        message: 'attached 3 files to Database Schema',
        type: 'file',
        timestamp: new Date(Date.now() - 720000),
      },
      {
        user: 'Emily Davis',
        message: 'completed Git Repository Setup',
        type: 'complete',
        timestamp: new Date(Date.now() - 1500000),
      },
    ];

    initialActivities.forEach(activity => {
      this.activities.push(activity);
      this.renderActivityItem(activity);
    });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new TimeTrackingManager();

  // Make app available globally for debugging
  window.timeTrackingApp = app;

  console.log('Time Tracking Manager initialized');
});
