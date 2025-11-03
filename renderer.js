// Auto Clicker Controls
const startClickerBtn = document.getElementById('start-clicker');
const stopClickerBtn = document.getElementById('stop-clicker');
const clickerStatus = document.getElementById('clicker-status');

// Mouse Mover Controls
const startMoverBtn = document.getElementById('start-mover');
const stopMoverBtn = document.getElementById('stop-mover');
const moverStatus = document.getElementById('mover-status');

// Swipe Controls
const swipeButtons = document.querySelectorAll('.btn-direction');
const swipeStatus = document.getElementById('swipe-status');

// Scroll Controls
const scrollUpBtn = document.getElementById('scroll-up');
const scrollDownBtn = document.getElementById('scroll-down');

// Mouse Position
const mouseXSpan = document.getElementById('mouse-x');
const mouseYSpan = document.getElementById('mouse-y');
const refreshPosBtn = document.getElementById('refresh-position');

// State
let isClickerActive = false;
let isMoverActive = false;

// Helper function to show status
function showStatus(element, message, isError = false) {
  element.textContent = message;
  element.className = 'status ' + (isError ? 'error' : 'active');
  if (!isError) {
    setTimeout(() => {
      element.textContent = '';
      element.className = 'status';
    }, 3000);
  }
}

// Auto Clicker
startClickerBtn.addEventListener('click', async () => {
  const interval = parseInt(document.getElementById('click-interval').value);
  const button = document.getElementById('click-button').value;
  const clickCount = parseInt(document.getElementById('click-count').value);

  const result = await window.electronAPI.startAutoClick({
    interval,
    button,
    clickCount
  });

  if (result.success) {
    isClickerActive = true;
    startClickerBtn.disabled = true;
    stopClickerBtn.disabled = false;
    showStatus(clickerStatus, `Auto clicking with ${button} button every ${interval}ms`);
  } else {
    showStatus(clickerStatus, `Error: ${result.error}`, true);
  }
});

stopClickerBtn.addEventListener('click', async () => {
  await window.electronAPI.stopAutoClick();
  isClickerActive = false;
  startClickerBtn.disabled = false;
  stopClickerBtn.disabled = true;
  clickerStatus.textContent = '';
  clickerStatus.className = 'status';
});

// Mouse Mover
startMoverBtn.addEventListener('click', async () => {
  const pattern = document.getElementById('move-pattern').value;
  const interval = parseInt(document.getElementById('move-interval').value);
  const range = parseInt(document.getElementById('move-range').value);

  const result = await window.electronAPI.startMouseMove({
    pattern,
    interval,
    range
  });

  if (result.success) {
    isMoverActive = true;
    startMoverBtn.disabled = true;
    stopMoverBtn.disabled = false;
    showStatus(moverStatus, `Moving mouse in ${pattern} pattern every ${interval}ms`);
  } else {
    showStatus(moverStatus, `Error: ${result.error}`, true);
  }
});

stopMoverBtn.addEventListener('click', async () => {
  await window.electronAPI.stopMouseMove();
  isMoverActive = false;
  startMoverBtn.disabled = false;
  stopMoverBtn.disabled = true;
  moverStatus.textContent = '';
  moverStatus.className = 'status';
});

// Swipe Simulation
swipeButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const direction = button.dataset.direction;
    const distance = parseInt(document.getElementById('swipe-distance').value);

    showStatus(swipeStatus, `Swiping ${direction}...`);
    
    const result = await window.electronAPI.simulateSwipe({
      direction,
      distance
    });

    if (result.success) {
      showStatus(swipeStatus, `Swiped ${direction} ${distance}px`);
    } else {
      showStatus(swipeStatus, `Error: ${result.error}`, true);
    }
  });
});

// Scroll
scrollUpBtn.addEventListener('click', async () => {
  const amount = parseInt(document.getElementById('scroll-amount').value);
  const result = await window.electronAPI.simulateScroll({
    direction: 'up',
    amount
  });

  if (result.success) {
    showStatus(swipeStatus, 'Scrolled up');
  } else {
    showStatus(swipeStatus, `Error: ${result.error}`, true);
  }
});

scrollDownBtn.addEventListener('click', async () => {
  const amount = parseInt(document.getElementById('scroll-amount').value);
  const result = await window.electronAPI.simulateScroll({
    direction: 'down',
    amount
  });

  if (result.success) {
    showStatus(swipeStatus, 'Scrolled down');
  } else {
    showStatus(swipeStatus, `Error: ${result.error}`, true);
  }
});

// Mouse Position
async function updateMousePosition() {
  const result = await window.electronAPI.getMousePosition();
  if (result.success) {
    mouseXSpan.textContent = result.x;
    mouseYSpan.textContent = result.y;
  }
}

refreshPosBtn.addEventListener('click', updateMousePosition);

// Update position every 500ms
setInterval(updateMousePosition, 500);

// Initialize position on load
updateMousePosition();

// Set up hotkey listeners for auto clicker
window.electronAPI.onStartClickerFromHotkey(() => {
  if (!isClickerActive) {
    startClickerBtn.click();
  }
});

window.electronAPI.onClickerToggled((isActive) => {
  if (!isActive && isClickerActive) {
    stopClickerBtn.click();
  }
});

// Set up hotkey listeners for mouse mover
window.electronAPI.onStartMoverFromHotkey(() => {
  if (!isMoverActive) {
    startMoverBtn.click();
  }
});

window.electronAPI.onMoverToggled((isActive) => {
  if (!isActive && isMoverActive) {
    stopMoverBtn.click();
  }
});

// Keyboard Automation Controls
const recordShortcutBtn = document.getElementById('record-shortcut');
const typeShortcutBtn = document.getElementById('type-shortcut');
const addShortcutBtn = document.getElementById('add-shortcut');
const clearShortcutsBtn = document.getElementById('clear-shortcuts');
const startShortcutBtn = document.getElementById('start-shortcut');
const stopShortcutBtn = document.getElementById('stop-shortcut');
const shortcutKeysInput = document.getElementById('shortcut-keys');
const recordingHint = document.getElementById('recording-hint');
const shortcutsItemsDiv = document.getElementById('shortcuts-items');
const startTypingBtn = document.getElementById('start-typing');
const stopTypingBtn = document.getElementById('stop-typing');
const keyboardStatus = document.getElementById('keyboard-status');

let isShortcutActive = false;
let isTypingActive = false;
let isRecording = false;
let isManualMode = false;
let recordedKeys = [];
let shortcutsList = [];

// Key mapping for display
const keyMap = {
  'Control': 'control',
  'Meta': 'command',
  'Shift': 'shift',
  'Alt': 'option',
  ' ': 'space',
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right'
};

// Type manually mode
typeShortcutBtn.addEventListener('click', () => {
  isManualMode = true;
  isRecording = false;
  shortcutKeysInput.removeAttribute('readonly');
  shortcutKeysInput.value = '';
  shortcutKeysInput.focus();
  shortcutKeysInput.placeholder = 'e.g. control+right, command+option+esc';
  recordingHint.textContent = '⌨️ Type your shortcut (format: modifier+key)';
  recordingHint.style.color = '#3498db';
  typeShortcutBtn.style.background = '#3498db';
  recordShortcutBtn.style.background = '';
  
  setTimeout(() => {
    recordingHint.style.color = '';
    recordingHint.textContent = 'Type manually or click Record to capture';
  }, 3000);
});

// Record keyboard shortcut
recordShortcutBtn.addEventListener('click', () => {
  isRecording = !isRecording;
  isManualMode = false;
  
  if (isRecording) {
    recordedKeys = [];
    shortcutKeysInput.value = '';
    shortcutKeysInput.setAttribute('readonly', true);
    recordShortcutBtn.textContent = '⏺️ Recording...';
    recordShortcutBtn.style.background = '#e74c3c';
    typeShortcutBtn.style.background = '';
    recordingHint.textContent = '🎙️ Press your key combination now...';
    recordingHint.classList.add('recording');
    shortcutKeysInput.focus();
    
    // Add window-level listeners to catch system shortcuts
    window.addEventListener('keydown', globalKeyCapture, true);
    window.addEventListener('keyup', globalKeyCapture, true);
  } else {
    recordShortcutBtn.textContent = '🎙️ Record Keys';
    recordShortcutBtn.style.background = '';
    recordingHint.textContent = 'Type manually or click Record to capture';
    recordingHint.classList.remove('recording');
    
    // Remove window-level listeners
    window.removeEventListener('keydown', globalKeyCapture, true);
    window.removeEventListener('keyup', globalKeyCapture, true);
  }
});

// Global key capture function - runs at window level during capture phase
function globalKeyCapture(e) {
  if (!isRecording) return;
  
  // ALWAYS prevent default and stop propagation to block system shortcuts
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  // Only process keydown events for recording
  if (e.type !== 'keydown') return;
  
  // Show what modifiers are currently held
  let tempKeys = [];
  if (e.ctrlKey) tempKeys.push('control');
  if (e.metaKey) tempKeys.push('command');
  if (e.shiftKey) tempKeys.push('shift');
  if (e.altKey) tempKeys.push('option');
  
  // Only capture when a non-modifier key is pressed
  if (['Control', 'Meta', 'Shift', 'Alt', 'Command'].includes(e.key)) {
    // User is still pressing modifiers, show them what's held
    if (tempKeys.length > 0) {
      shortcutKeysInput.value = tempKeys.join('+') + '+...';
    }
    return;
  }
  
  // Now capture the full combination
  recordedKeys = [];
  
  // Capture modifiers in the correct order
  if (e.ctrlKey) recordedKeys.push('control');
  if (e.metaKey) recordedKeys.push('command');
  if (e.shiftKey) recordedKeys.push('shift');
  if (e.altKey) recordedKeys.push('option');
  
  // Capture main key with better mapping
  let key = e.key;
  
  // Handle special keys
  if (keyMap[key]) {
    key = keyMap[key];
  } else if (key.length === 1) {
    key = key.toLowerCase();
  } else if (key.startsWith('Arrow')) {
    key = key.replace('Arrow', '').toLowerCase();
  } else {
    key = key.toLowerCase();
  }
  
  recordedKeys.push(key);
  
  // Display captured keys
  const keysString = recordedKeys.join('+');
  shortcutKeysInput.value = keysString;
  
  // Stop recording and enable add button
  isRecording = false;
  recordShortcutBtn.textContent = '🎙️ Record Keys';
  recordShortcutBtn.style.background = '';
  
  // Remove window-level listeners
  window.removeEventListener('keydown', globalKeyCapture, true);
  window.removeEventListener('keyup', globalKeyCapture, true);
  
  if (editingIndex !== null) {
    recordingHint.textContent = '✅ Keys captured! Click "Update" to save changes';
    addShortcutBtn.textContent = '💾 Update';
  } else {
    recordingHint.textContent = '✅ Keys captured! Click "Add to Sequence"';
    addShortcutBtn.textContent = '➕ Add to Sequence';
  }
  
  recordingHint.classList.remove('recording');
  recordingHint.style.color = '#27ae60';
  addShortcutBtn.disabled = false;
  
  setTimeout(() => {
    recordingHint.style.color = '';
    if (editingIndex === null) {
      recordingHint.textContent = 'Type manually or click Record to capture';
    }
  }, 2000);
}

// Enable add button when typing manually
shortcutKeysInput.addEventListener('input', () => {
  const value = shortcutKeysInput.value.trim();
  if (value && (isManualMode || !isRecording)) {
    addShortcutBtn.disabled = false;
  } else {
    addShortcutBtn.disabled = true;
  }
});

// Add shortcut to list
addShortcutBtn.addEventListener('click', () => {
  const keys = shortcutKeysInput.value.trim();
  if (!keys) return;
  
  if (editingIndex !== null) {
    // Update existing shortcut
    shortcutsList[editingIndex] = keys;
    showStatus(keyboardStatus, `Updated shortcut #${editingIndex + 1}`, false);
    editingIndex = null;
    addShortcutBtn.textContent = '➕ Add to Sequence';
  } else {
    // Add new shortcut
    shortcutsList.push(keys);
    showStatus(keyboardStatus, `Added: ${keys}`, false);
  }
  
  updateShortcutsList();
  
  // Clear input and disable add button
  shortcutKeysInput.value = '';
  addShortcutBtn.disabled = true;
  
  // Enable start button
  startShortcutBtn.disabled = false;
});

// Update shortcuts list display
function updateShortcutsList() {
  if (shortcutsList.length === 0) {
    shortcutsItemsDiv.innerHTML = '<div class="empty-state">No shortcuts added yet</div>';
    startShortcutBtn.disabled = true;
    return;
  }
  
  shortcutsItemsDiv.innerHTML = shortcutsList.map((keys, index) => `
    <div class="shortcut-item" draggable="true" data-index="${index}">
      <span class="shortcut-drag-handle">⋮⋮</span>
      <div class="shortcut-item-content">
        <span class="shortcut-number">${index + 1}</span>
        <span class="shortcut-keys">${keys}</span>
      </div>
      <div class="shortcut-actions">
        <button class="shortcut-edit" onclick="editShortcut(${index})">✏️ Edit</button>
        <button class="shortcut-remove" onclick="removeShortcut(${index})">✕</button>
      </div>
    </div>
  `).join('');
  
  // Add drag and drop event listeners
  setupDragAndDrop();
}

// Drag and drop functionality
let draggedIndex = null;

function setupDragAndDrop() {
  const items = shortcutsItemsDiv.querySelectorAll('.shortcut-item');
  
  items.forEach((item) => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  draggedIndex = parseInt(e.target.getAttribute('data-index'));
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  e.target.closest('.shortcut-item')?.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.target.closest('.shortcut-item')?.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  const dropTarget = e.target.closest('.shortcut-item');
  if (!dropTarget) return false;
  
  const dropIndex = parseInt(dropTarget.getAttribute('data-index'));
  
  if (draggedIndex !== dropIndex && draggedIndex !== null) {
    // Reorder the array
    const draggedItem = shortcutsList[draggedIndex];
    shortcutsList.splice(draggedIndex, 1);
    shortcutsList.splice(dropIndex, 0, draggedItem);
    
    updateShortcutsList();
    showStatus(keyboardStatus, 'Shortcuts reordered', false);
  }
  
  return false;
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  
  // Remove all drag-over classes
  const items = shortcutsItemsDiv.querySelectorAll('.shortcut-item');
  items.forEach(item => item.classList.remove('drag-over'));
  
  draggedIndex = null;
}

// Edit existing shortcut
let editingIndex = null;

window.editShortcut = (index) => {
  editingIndex = index;
  
  // Put current value in input for editing
  shortcutKeysInput.value = shortcutsList[index];
  shortcutKeysInput.removeAttribute('readonly');
  isManualMode = true;
  isRecording = false;
  
  shortcutKeysInput.focus();
  shortcutKeysInput.select();
  
  recordingHint.textContent = `✏️ Editing shortcut #${index + 1} - type or record new keys`;
  recordingHint.style.color = '#3498db';
  addShortcutBtn.disabled = false;
  addShortcutBtn.textContent = '💾 Update';
  
  showStatus(keyboardStatus, `Editing shortcut #${index + 1}`, false);
  
  setTimeout(() => {
    recordingHint.style.color = '';
  }, 2000);
};

// Remove individual shortcut
window.removeShortcut = (index) => {
  shortcutsList.splice(index, 1);
  updateShortcutsList();
  showStatus(keyboardStatus, 'Shortcut removed', false);
};

// Clear all shortcuts
clearShortcutsBtn.addEventListener('click', () => {
  shortcutsList = [];
  editingIndex = null;
  isManualMode = false;
  isRecording = false;
  updateShortcutsList();
  shortcutKeysInput.value = '';
  shortcutKeysInput.setAttribute('readonly', true);
  addShortcutBtn.disabled = true;
  addShortcutBtn.textContent = '➕ Add to Sequence';
  recordShortcutBtn.style.background = '';
  typeShortcutBtn.style.background = '';
  recordingHint.textContent = 'Type manually or click Record to capture';
  showStatus(keyboardStatus, 'All shortcuts cleared', false);
});

// Start keyboard shortcuts sequence
startShortcutBtn.addEventListener('click', async () => {
  if (shortcutsList.length === 0) {
    showStatus(keyboardStatus, 'Please add shortcuts first', true);
    return;
  }

  const interval = parseInt(document.getElementById('shortcut-interval').value);

  // Send the entire shortcuts list to the backend
  const result = await window.electronAPI.startKeyboardShortcut({
    keys: shortcutsList,
    interval
  });

  if (result.success) {
    isShortcutActive = true;
    startShortcutBtn.disabled = true;
    stopShortcutBtn.disabled = false;
    recordShortcutBtn.disabled = true;
    addShortcutBtn.disabled = true;
    clearShortcutsBtn.disabled = true;
    
    if (shortcutsList.length === 1) {
      showStatus(keyboardStatus, `Pressing ${shortcutsList[0]} every ${interval}ms`);
    } else {
      showStatus(keyboardStatus, `Running sequence of ${shortcutsList.length} shortcuts every ${interval}ms`);
    }
  } else {
    showStatus(keyboardStatus, `Error: ${result.error}`, true);
  }
});

stopShortcutBtn.addEventListener('click', async () => {
  await window.electronAPI.stopKeyboardShortcut();
  isShortcutActive = false;
  startShortcutBtn.disabled = false;
  stopShortcutBtn.disabled = true;
  recordShortcutBtn.disabled = false;
  addShortcutBtn.disabled = shortcutKeysInput.value.trim() === '';
  clearShortcutsBtn.disabled = false;
  keyboardStatus.textContent = '';
  keyboardStatus.className = 'status';
});

// Random Typing
startTypingBtn.addEventListener('click', async () => {
  const text = document.getElementById('typing-text').value;
  const minInterval = parseInt(document.getElementById('typing-min-interval').value);
  const maxInterval = parseInt(document.getElementById('typing-max-interval').value);

  if (!text) {
    showStatus(keyboardStatus, 'Please enter text to type', true);
    return;
  }

  if (minInterval > maxInterval) {
    showStatus(keyboardStatus, 'Min interval must be less than max interval', true);
    return;
  }

  const result = await window.electronAPI.startRandomTyping({
    text,
    minInterval,
    maxInterval
  });

  if (result.success) {
    isTypingActive = true;
    startTypingBtn.disabled = true;
    stopTypingBtn.disabled = false;
    showStatus(keyboardStatus, `Typing with ${minInterval}-${maxInterval}ms intervals`);
  } else {
    showStatus(keyboardStatus, `Error: ${result.error}`, true);
  }
});

stopTypingBtn.addEventListener('click', async () => {
  await window.electronAPI.stopRandomTyping();
  isTypingActive = false;
  startTypingBtn.disabled = false;
  stopTypingBtn.disabled = true;
  keyboardStatus.textContent = '';
  keyboardStatus.className = 'status';
});

// Set up hotkey listeners for keyboard shortcuts
window.electronAPI.onStartKeyboardFromHotkey(() => {
  if (!isShortcutActive) {
    startShortcutBtn.click();
  }
});

window.electronAPI.onKeyboardToggled((isActive) => {
  if (!isActive && isShortcutActive) {
    stopShortcutBtn.click();
  }
});

// Set up hotkey listeners for random typing
window.electronAPI.onStartTypingFromHotkey(() => {
  if (!isTypingActive) {
    startTypingBtn.click();
  }
});

window.electronAPI.onTypingToggled((isActive) => {
  if (!isActive && isTypingActive) {
    stopTypingBtn.click();
  }
});

// Listen for emergency stop
window.electronAPI.onAutomationStopped(() => {
  if (isClickerActive) {
    isClickerActive = false;
    startClickerBtn.disabled = false;
    stopClickerBtn.disabled = true;
    showStatus(clickerStatus, 'Stopped by emergency hotkey');
  }
  if (isMoverActive) {
    isMoverActive = false;
    startMoverBtn.disabled = false;
    stopMoverBtn.disabled = true;
    showStatus(moverStatus, 'Stopped by emergency hotkey');
  }
  if (isShortcutActive) {
    isShortcutActive = false;
    startShortcutBtn.disabled = false;
    stopShortcutBtn.disabled = true;
    showStatus(keyboardStatus, 'Stopped by emergency hotkey');
  }
  if (isTypingActive) {
    isTypingActive = false;
    startTypingBtn.disabled = false;
    stopTypingBtn.disabled = true;
    showStatus(keyboardStatus, 'Stopped by emergency hotkey');
  }
});

// ==================== AI AUTOMATION ====================

// AI Automation Elements
const openaiApiKeyInput = document.getElementById('openai-api-key');
const toggleApiKeyVisibilityBtn = document.getElementById('toggle-api-key-visibility');
const saveApiKeyBtn = document.getElementById('save-api-key');
const aiPromptTextarea = document.getElementById('ai-prompt');
const generateAICommandsBtn = document.getElementById('generate-ai-commands');
const executeAICommandsBtn = document.getElementById('execute-ai-commands');
const stopLoopBtn = document.getElementById('stop-loop');
const clearAICommandsBtn = document.getElementById('clear-ai-commands');
const aiCommandsPreview = document.getElementById('ai-commands-preview');
const aiCommandsList = document.getElementById('ai-commands-list');
const commandCountBadge = document.getElementById('command-count');
const commandDelayInput = document.getElementById('command-delay');
const loopCountSelect = document.getElementById('loop-count');
const loopDelayInput = document.getElementById('loop-delay');
const jsonCommandsTextarea = document.getElementById('json-commands');
const jsonCommandDelayInput = document.getElementById('json-command-delay');
const validateJsonCommandsBtn = document.getElementById('validate-json-commands');
const executeJsonCommandsBtn = document.getElementById('execute-json-commands');
const stopJsonLoopBtn = document.getElementById('stop-json-loop');
const jsonLoopCountSelect = document.getElementById('json-loop-count');
const aiStatus = document.getElementById('ai-status');

let generatedCommands = [];
let isLoopRunning = false;

// Load saved API key on startup
(async () => {
  const result = await window.electronAPI.loadApiKey();
  if (result.success && result.apiKey) {
    openaiApiKeyInput.value = result.apiKey;
  }
})();

// Toggle API Key Visibility
toggleApiKeyVisibilityBtn.addEventListener('click', () => {
  if (openaiApiKeyInput.type === 'password') {
    openaiApiKeyInput.type = 'text';
    toggleApiKeyVisibilityBtn.textContent = '🙈';
  } else {
    openaiApiKeyInput.type = 'password';
    toggleApiKeyVisibilityBtn.textContent = '👁️';
  }
});

// Save API Key
saveApiKeyBtn.addEventListener('click', async () => {
  const apiKey = openaiApiKeyInput.value.trim();
  
  if (!apiKey) {
    showStatus(aiStatus, 'Please enter an API key', true);
    return;
  }
  
  if (!apiKey.startsWith('sk-')) {
    showStatus(aiStatus, 'Invalid API key format. Should start with "sk-"', true);
    return;
  }
  
  const result = await window.electronAPI.saveApiKey(apiKey);
  
  if (result.success) {
    showStatus(aiStatus, '✅ API key saved securely');
  } else {
    showStatus(aiStatus, `Error saving API key: ${result.error}`, true);
  }
});

// Generate AI Commands
generateAICommandsBtn.addEventListener('click', async () => {
  const prompt = aiPromptTextarea.value.trim();
  const apiKey = openaiApiKeyInput.value.trim();
  
  if (!apiKey) {
    showStatus(aiStatus, 'Please enter and save your OpenAI API key first', true);
    return;
  }
  
  if (!prompt) {
    showStatus(aiStatus, 'Please describe what you want to automate', true);
    return;
  }
  
  // Disable button and show loading
  generateAICommandsBtn.disabled = true;
  generateAICommandsBtn.textContent = '⏳ Generating...';
  showStatus(aiStatus, 'Asking AI to generate commands...');
  
  try {
    const result = await window.electronAPI.executeAICommand({
      prompt,
      apiKey
    });
    
    if (result.success && result.commands) {
      generatedCommands = result.commands;
      displayGeneratedCommands(result.commands);
      executeAICommandsBtn.disabled = false;
      clearAICommandsBtn.disabled = false;
      showStatus(aiStatus, `✅ Generated ${result.commands.length} commands`);
    } else {
      showStatus(aiStatus, `Error: ${result.error}`, true);
      generatedCommands = [];
    }
  } catch (error) {
    showStatus(aiStatus, `Error: ${error.message}`, true);
    generatedCommands = [];
  } finally {
    generateAICommandsBtn.disabled = false;
    generateAICommandsBtn.textContent = '✨ Generate Commands';
  }
});

// Display Generated Commands
function displayGeneratedCommands(commands) {
  commandCountBadge.textContent = commands.length;
  
  aiCommandsList.innerHTML = commands.map((cmd, index) => {
    const paramsStr = cmd.params ? JSON.stringify(cmd.params) : '{}';
    return `
      <div class="command-item">
        <span class="command-number">${index + 1}</span>
        <div class="command-details">
          <div class="command-type">${cmd.type}</div>
          <div class="command-description">${cmd.description || 'No description'}</div>
          <div class="command-params">${paramsStr}</div>
        </div>
      </div>
    `;
  }).join('');
  
  aiCommandsPreview.style.display = 'block';
}

// Execute AI Generated Commands
executeAICommandsBtn.addEventListener('click', async () => {
  if (generatedCommands.length === 0) {
    showStatus(aiStatus, 'No commands to execute', true);
    return;
  }
  
  const loopCount = parseInt(loopCountSelect.value);
  const commandDelay = parseInt(commandDelayInput.value);
  const isInfiniteLoop = loopCount === -1;
  
  executeAICommandsBtn.disabled = true;
  executeAICommandsBtn.textContent = '⏳ Executing...';
  
  if (isInfiniteLoop) {
    isLoopRunning = true;
    stopLoopBtn.disabled = false;
    stopLoopBtn.style.display = 'flex';
    showStatus(aiStatus, `🔄 Running infinite loop with ${commandDelay}ms delay (Press Stop or ⌘ Shift X to stop)`);
  } else if (loopCount > 1) {
    showStatus(aiStatus, `Executing ${generatedCommands.length} commands ${loopCount} times with ${commandDelay}ms delay...`);
  } else {
    showStatus(aiStatus, `Executing ${generatedCommands.length} commands with ${commandDelay}ms delay...`);
  }
  
  try {
    const shouldRepeat = loopCount > 1 || isInfiniteLoop;
    const result = await window.electronAPI.executeCommandSequence(generatedCommands, shouldRepeat, loopCount, commandDelay);
    
    if (result.success) {
      if (isInfiniteLoop) {
        showStatus(aiStatus, '🔄 Infinite loop running...');
      } else {
        showStatus(aiStatus, '✅ All commands executed successfully');
      }
    } else {
      showStatus(aiStatus, `Error during execution: ${result.error}`, true);
    }
  } catch (error) {
    showStatus(aiStatus, `Error: ${error.message}`, true);
  } finally {
    if (!isInfiniteLoop) {
      executeAICommandsBtn.disabled = false;
      executeAICommandsBtn.textContent = '▶️ Execute';
      isLoopRunning = false;
    }
  }
});

// Stop Loop
stopLoopBtn.addEventListener('click', async () => {
  await window.electronAPI.stopCommandLoop();
  isLoopRunning = false;
  stopLoopBtn.disabled = true;
  stopLoopBtn.style.display = 'none';
  executeAICommandsBtn.disabled = false;
  executeAICommandsBtn.textContent = '▶️ Execute';
  showStatus(aiStatus, '⏹️ Loop stopped');
});

// Clear AI Commands
clearAICommandsBtn.addEventListener('click', () => {
  generatedCommands = [];
  aiCommandsList.innerHTML = '';
  aiCommandsPreview.style.display = 'none';
  executeAICommandsBtn.disabled = true;
  clearAICommandsBtn.disabled = true;
  commandCountBadge.textContent = '0';
  showStatus(aiStatus, 'Commands cleared');
});

// Validate JSON Commands
validateJsonCommandsBtn.addEventListener('click', () => {
  const jsonText = jsonCommandsTextarea.value.trim();
  
  if (!jsonText) {
    showStatus(aiStatus, 'Please paste JSON commands first', true);
    return;
  }
  
  try {
    const commands = JSON.parse(jsonText);
    
    if (!Array.isArray(commands)) {
      showStatus(aiStatus, 'JSON must be an array of commands', true);
      return;
    }
    
    // Validate command structure
    const validTypes = ['click', 'move', 'moveTo', 'type', 'keypress', 'scroll', 'swipe', 'wait'];
    const invalidCommands = commands.filter(cmd => !validTypes.includes(cmd.type));
    
    if (invalidCommands.length > 0) {
      showStatus(aiStatus, `Invalid command types found: ${invalidCommands.map(c => c.type).join(', ')}`, true);
      return;
    }
    
    showStatus(aiStatus, `✅ Valid JSON with ${commands.length} commands`);
    
    // Display the commands
    generatedCommands = commands;
    displayGeneratedCommands(commands);
    executeAICommandsBtn.disabled = false;
    clearAICommandsBtn.disabled = false;
  } catch (error) {
    showStatus(aiStatus, `Invalid JSON: ${error.message}`, true);
  }
});

// Execute JSON Commands
executeJsonCommandsBtn.addEventListener('click', async () => {
  const jsonText = jsonCommandsTextarea.value.trim();
  
  if (!jsonText) {
    showStatus(aiStatus, 'Please paste JSON commands first', true);
    return;
  }
  
  try {
    const commands = JSON.parse(jsonText);
    
    if (!Array.isArray(commands)) {
      showStatus(aiStatus, 'JSON must be an array of commands', true);
      return;
    }
    
    const loopCount = parseInt(jsonLoopCountSelect.value);
    const commandDelay = parseInt(jsonCommandDelayInput.value);
    const isInfiniteLoop = loopCount === -1;
    
    executeJsonCommandsBtn.disabled = true;
    executeJsonCommandsBtn.textContent = '⏳ Executing...';
    
    if (isInfiniteLoop) {
      isLoopRunning = true;
      stopJsonLoopBtn.disabled = false;
      stopJsonLoopBtn.style.display = 'flex';
      showStatus(aiStatus, `🔄 Running infinite loop with ${commandDelay}ms delay (Press Stop or ⌘ Shift X to stop)`);
    } else if (loopCount > 1) {
      showStatus(aiStatus, `Executing ${commands.length} commands ${loopCount} times with ${commandDelay}ms delay...`);
    } else {
      showStatus(aiStatus, `Executing ${commands.length} commands with ${commandDelay}ms delay...`);
    }
    
    const shouldRepeat = loopCount > 1 || isInfiniteLoop;
    const result = await window.electronAPI.executeCommandSequence(commands, shouldRepeat, loopCount, commandDelay);
    
    if (result.success) {
      if (isInfiniteLoop) {
        showStatus(aiStatus, '🔄 Infinite loop running...');
      } else {
        showStatus(aiStatus, '✅ All commands executed successfully');
      }
    } else {
      showStatus(aiStatus, `Error during execution: ${result.error}`, true);
    }
  } catch (error) {
    showStatus(aiStatus, `Error: ${error.message}`, true);
  } finally {
    if (!isInfiniteLoop) {
      executeJsonCommandsBtn.disabled = false;
      executeJsonCommandsBtn.textContent = '▶️ Execute JSON';
      isLoopRunning = false;
    }
  }
});

// Stop JSON Loop
stopJsonLoopBtn.addEventListener('click', async () => {
  await window.electronAPI.stopCommandLoop();
  isLoopRunning = false;
  stopJsonLoopBtn.disabled = true;
  stopJsonLoopBtn.style.display = 'none';
  executeJsonCommandsBtn.disabled = false;
  executeJsonCommandsBtn.textContent = '▶️ Execute JSON';
  showStatus(aiStatus, '⏹️ Loop stopped');
});

