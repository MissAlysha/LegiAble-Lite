// Load saved settings when popup opens
chrome.storage.sync.get(['fontEnabled', 'rulerEnabled'], function(result) {
  const fontToggle = document.getElementById('fontToggle');
  const rulerToggle = document.getElementById('rulerToggle');
  
  if (fontToggle) {
    fontToggle.checked = result.fontEnabled || false;
  }
  if (rulerToggle) {
    rulerToggle.checked = result.rulerEnabled || false;
  }
});

// Handle font toggle
document.getElementById('fontToggle').addEventListener('change', function(e) {
  const enabled = e.target.checked;
  
  // Save the setting
  chrome.storage.sync.set({ fontEnabled: enabled }, function() {
    console.log('Font setting saved:', enabled);
  });
  
  // Send message to active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleFont',
        enabled: enabled
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Message error (will work on refresh):', chrome.runtime.lastError.message);
        }
      });
    }
  });
});

// Handle ruler toggle
document.getElementById('rulerToggle').addEventListener('change', function(e) {
  const enabled = e.target.checked;
  
  // Save the setting
  chrome.storage.sync.set({ rulerEnabled: enabled }, function() {
    console.log('Ruler setting saved:', enabled);
  });
  
  // Send message to active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleRuler',
        enabled: enabled
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Message error (will work on refresh):', chrome.runtime.lastError.message);
        }
      });
    }
  });
});