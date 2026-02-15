// State
let rulerOverlay = null;
let mouseY = window.innerHeight / 2;
let animationFrameId = null;

// Initialize from storage immediately
chrome.storage.sync.get(['fontEnabled', 'rulerEnabled'], (result) => {
  if (result.fontEnabled) {
    enableFont();
  }
  if (result.rulerEnabled) {
    enableRuler();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFont') {
    if (request.enabled) {
      enableFont();
    } else {
      disableFont();
    }
  } else if (request.action === 'toggleRuler') {
    if (request.enabled) {
      enableRuler();
    } else {
      disableRuler();
    }
  }
  sendResponse({success: true});
  return true;
});

function enableFont() {
  document.documentElement.classList.add('dyslexic-font-enabled');
  document.body.classList.add('dyslexic-font-enabled');
}

function disableFont() {
  document.documentElement.classList.remove('dyslexic-font-enabled');
  document.body.classList.remove('dyslexic-font-enabled');
}

function enableRuler() {
  if (rulerOverlay) return;

  // Create overlay with blur sections
  rulerOverlay = document.createElement('div');
  rulerOverlay.id = 'reading-ruler-overlay';
  rulerOverlay.innerHTML = `
    <div class="ruler-blur-top"></div>
    <div class="ruler-clear-zone"></div>
    <div class="ruler-blur-bottom"></div>
  `;
  
  document.body.appendChild(rulerOverlay);

  // Track mouse movement with throttling
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('resize', updateRulerPosition, { passive: true });
  window.addEventListener('scroll', updateRulerPosition, { passive: true });

  updateRulerPosition();
}

function disableRuler() {
  if (!rulerOverlay) return;

  document.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', updateRulerPosition);
  window.removeEventListener('scroll', updateRulerPosition);
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  rulerOverlay.remove();
  rulerOverlay = null;
}

function handleMouseMove(e) {
  mouseY = e.clientY;
  
  // Use requestAnimationFrame for smooth updates
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  animationFrameId = requestAnimationFrame(updateRulerPosition);
}

function updateRulerPosition() {
  if (!rulerOverlay) return;

  const rulerHeight = 50;
  const topHeight = Math.max(0, mouseY - rulerHeight / 2);
  const bottomTop = mouseY + rulerHeight / 2;

  const topBlur = rulerOverlay.querySelector('.ruler-blur-top');
  const clearZone = rulerOverlay.querySelector('.ruler-clear-zone');
  const bottomBlur = rulerOverlay.querySelector('.ruler-blur-bottom');

  if (topBlur && clearZone && bottomBlur) {
    topBlur.style.height = `${topHeight}px`;
    clearZone.style.top = `${topHeight}px`;
    clearZone.style.height = `${rulerHeight}px`;
    bottomBlur.style.top = `${bottomTop}px`;
  }
}