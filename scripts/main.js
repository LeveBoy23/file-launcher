

/* Extracted inline scripts from original HTML */
(function(){
        const btn = document.getElementById('chat-btn');
        if(!btn) return;
        btn.addEventListener('click', () => {
          window.open('https://levy.fwh.is/Zap', '_blank');
        });
      })();
    


    // ---- Supabase client ----
    const SUPABASE_URL = 'https://pdqddhumgcjpzxjmzval.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcWRkaHVtZ2NqcHp4am16dmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk5ODMsImV4cCI6MjA2NTc1NTk4M30.cYVCjH960p_zBqLN7zhWpK8XI0s8PrZJwP5UL0lWEr4';
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ---- DOM refs (original + settings) ----
    const gameListDiv = document.getElementById('game-list');
    const codeInput = document.getElementById('code-input');
    const runBtn = document.getElementById('run-btn');
    const runNewTabBtn = document.getElementById('run-newtab-btn');
    const previewContainer = document.getElementById('preview-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
    const searchInput = document.getElementById('search-input');
    const categoryButtonsContainer = document.getElementById('category-buttons');
    const adminPanel = document.getElementById('admin-panel');
    const gameNameInput = document.getElementById('game-name');
    const gameCategorySelect = document.getElementById('game-category-select');
    const gameCodeInput = document.getElementById('game-code');
    const addGameBtn = document.getElementById('add-game-btn');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const refreshGamesBtn = document.getElementById('refresh-games-btn');
    const exportGamesBtn = document.getElementById('export-games-btn');
    const testConnectionBtn = document.getElementById('test-connection-btn');
    const editGamesBtn = document.getElementById('edit-games-btn');
    const editGamesSection = document.getElementById('edit-games-section');
    const gameSelect = document.getElementById('game-select');
    const editForm = document.getElementById('edit-form');
    const editGameName = document.getElementById('edit-game-name');
    const editGameCategorySelect = document.getElementById('edit-game-category-select');
    const editGameCode = document.getElementById('edit-game-code');
    const updateGameBtn = document.getElementById('update-game-btn');
    const deleteGameBtn = document.getElementById('delete-game-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('admin-password-input');

    const showAddCategoryBtn = document.getElementById('show-add-category-btn');
    const newCategoryContainer = document.getElementById('new-category-container');
    const newCategoryInput = document.getElementById('new-category-input');
    const addCategoryBtn = document.getElementById('add-category-btn');

    // Settings DOM
    const settingsBtn = document.getElementById('settings-btn');
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    const swatches = document.querySelectorAll('.swatch');
    const matrixControls = document.getElementById('matrix-controls');
    const matrixSpeed = document.getElementById('matrix-speed');
    const matrixColor = document.getElementById('matrix-color');
    const cardSize = document.getElementById('card-size');
    const toggleAnimations = document.getElementById('toggle-animations');
    const toggleSfx = document.getElementById('toggle-sfx');
    const bgMusicSelect = document.getElementById('bg-music');
    const prefSaveStatus = document.getElementById('pref-save-status');
    
    // New gameplay feature DOM refs
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesList = document.getElementById('favorites-list');
    const favoritesCount = document.getElementById('favorites-count');
    const recentSection = document.getElementById('recent-section');
    const recentList = document.getElementById('recent-list');
    const recentCount = document.getElementById('recent-count');
    const sessionInfo = document.getElementById('session-info');
    const sessionGame = document.getElementById('session-game');
    const sessionTime = document.getElementById('session-time');
    const showFavorites = document.getElementById('show-favorites');
    const showRecent = document.getElementById('show-recent');
    const trackPlaytime = document.getElementById('track-playtime');
    const clearRecentBtn = document.getElementById('clear-recent-btn');
    const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
    const offlineMode = document.getElementById('offline-mode');
    const preloadGames = document.getElementById('preload-games');
    const cacheStatus = document.getElementById('cache-status');
    const clearCacheBtn = document.getElementById('clear-cache-btn');
    
    // Login DOM refs
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginUsername = document.getElementById('login-username');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginCancelBtn = document.getElementById('login-cancel-btn');
    const loginStatus = document.getElementById('login-status');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    let allGames = [];

    // --- Helpers to normalize category storage (comma-separated in DB) ---
    function splitCategories(raw) {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
      return String(raw).split(',').map(s => s.trim()).filter(Boolean);
    }
    function joinCategories(arr) {
      if (!arr || arr.length === 0) return null;
      return arr.join(',');
    }

    // Test Supabase connection
    async function testConnection() {
      try {
        console.log('Testing Supabase connection...');
        console.log('Supabase URL:', SUPABASE_URL);
        console.log('Using table: Files');
        
        const { data, error } = await client.from('Files').select('*').limit(1);
        if (error) {
          console.error('Connection test failed:', error);
          return false;
        }
        console.log('Connection test successful!', data);
        return true;
      } catch (err) {
        console.error('Connection test error:', err);
        return false;
      }
    }

    async function loadGames() {
      try {
        console.log('Loading games from Supabase...');
        const { data, error } = await client.from('Files').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          gameListDiv.innerHTML = `<div style="color: #ff3333;">Failed to load games: ${error.message}</div>`;
          return;
        }
        
        console.log('Games loaded:', data);
        allGames = data ? data.sort((a, b) => (a.Name || '').localeCompare(b.Name || '')) : [];
        populateCategories();
        populateGameSelect();
        renderGameList(allGames);
        updateFavoritesDisplay();
        updateRecentDisplay();
        
      } catch (err) {
        console.error('Network error:', err);
        gameListDiv.innerHTML = `<div style="color: #ff3333;">Network error: ${err.message}</div>`;
      }
    }

    function renderGameList(games) {
      gameListDiv.innerHTML = '';
      if (!games || games.length === 0) {
        gameListDiv.innerHTML = '<div style="color: var(--accent); text-align: center; padding: 20px; grid-column: 1 / -1;">No games found.</div>';
        return;
      }
      
      games.forEach(game => {
        const button = createGameButton(game);
        gameListDiv.appendChild(button);
      });
    }
    
    function updateGameButtons() {
      // Re-render current games to update favorite stars
      const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || '';
      const filteredGames = (activeCategory === '') ? allGames : allGames.filter(game => {
        const parts = splitCategories(game.Category);
        return parts.includes(activeCategory);
      });
      renderGameList(filteredGames);
      updateFavoritesDisplay();
      updateRecentDisplay();
    }

    function populateCategories() {
      const set = new Set();
      allGames.forEach(g => {
        const parts = splitCategories(g.Category);
        parts.forEach(p => set.add(p));
      });

      const categories = Array.from(set).sort((a,b) => a.localeCompare(b));

      // Populate add-game select
      const placeholder = gameCategorySelect.querySelector('option[value=""]');
      gameCategorySelect.innerHTML = '';
      if (placeholder) gameCategorySelect.appendChild(placeholder);
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        gameCategorySelect.appendChild(opt);
      });

      // Populate edit-game select
      editGameCategorySelect.innerHTML = '';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        editGameCategorySelect.appendChild(opt);
      });

      // Ensure category buttons include these (don't duplicate hardcoded ones)
      const existingBtnCats = Array.from(categoryButtonsContainer.querySelectorAll('.category-btn')).map(b => b.dataset.category);
      categories.forEach(cat => {
        if (!existingBtnCats.includes(cat)) {
          const btn = document.createElement('button');
          btn.className = 'category-btn';
          btn.dataset.category = cat;
          btn.textContent = cat;
          categoryButtonsContainer.appendChild(btn);
        }
      });
    }
    
    function filterByCategory(category, buttonElement) {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      if (buttonElement) buttonElement.classList.add('active');

      const filteredGames = (category === '') ? allGames : allGames.filter(game => {
        const parts = splitCategories(game.Category);
        return parts.includes(category);
      });
      renderGameList(filteredGames);
    }
    
    function populateGameSelect() {
      gameSelect.innerHTML = '<option value="">Select a game to edit...</option>';
      allGames.forEach(game => {
        const option = document.createElement('option');
        option.value = game.id;
        option.textContent = game.Name;
        gameSelect.appendChild(option);
      });
    }
    
    function loadGameForEdit(gameId) {
      const game = allGames.find(g => g.id == gameId);
      if (game) {
        editGameName.value = game.Name || '';
        const cats = splitCategories(game.Category);
        Array.from(editGameCategorySelect.options).forEach(opt => { opt.selected = cats.includes(opt.value); });
        editGameCode.value = game.Code || '';
        editForm.style.display = 'block';
      }
    }
    
    async function updateGame() {
      const gameId = gameSelect.value;
      const Name = editGameName.value.trim();
      const Code = editGameCode.value.trim();
      const CategoryArray = Array.from(editGameCategorySelect.selectedOptions).map(o => o.value).filter(Boolean);
      const Category = joinCategories(CategoryArray);
      
      if (!gameId) {
        alert('No game selected.');
        return;
      }
      if (!Name || !Code) {
        alert('Please fill in all required fields (Name and Code).');
        return;
      }
      
      const { error } = await client
        .from('Files')
        .update({ Name, Code, Category })
        .eq('id', gameId);
        
      if (error) {
        console.error('Error updating game:', error);
        alert('Error updating game: ' + error.message);
        return;
      }
      
      alert('Game updated successfully!');
      editForm.style.display = 'none';
      editGamesSection.style.display = 'none';
      gameSelect.value = '';
      await loadGames();
    }
    
    async function deleteGame() {
      const gameId = gameSelect.value;
      const gameName = allGames.find(g => g.id == gameId)?.Name;
      
      if (!confirm(`Are you sure you want to delete "${gameName}"? This cannot be undone.`)) {
        return;
      }
      
      const { error } = await client
        .from('Files')
        .delete()
        .eq('id', gameId);
        
      if (error) {
        console.error('Error deleting game:', error);
        alert('Error deleting game: ' + error.message);
        return;
      }
      
      alert('Game deleted successfully!');
      editForm.style.display = 'none';
      editGamesSection.style.display = 'none';
      gameSelect.value = '';
      await loadGames();
    }

    function runCode() {
      const code = codeInput.value;
      previewContainer.querySelectorAll('iframe').forEach(e => e.remove());
      const iframe = document.createElement('iframe');
      iframe.sandbox = 'allow-scripts allow-same-origin';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '6px';
      previewContainer.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(code);
      doc.close();
    }

    // Fix run button - ensure it works correctly
    runBtn.addEventListener('click', (e) => {
      console.log('Run button clicked');
      e.preventDefault();
      endSession();
      runCode();
    });
    
    runNewTabBtn.addEventListener('click', (e) => {
      console.log('Run in new tab clicked');
      e.preventDefault();
      const newTab = window.open();
      newTab.document.write(codeInput.value);
      newTab.document.close();
    });

    let isFullscreen = false;
    let originalStyles = {};

    // Fix fullscreen button
    fullscreenBtn.addEventListener('click', (e) => {
      console.log('Fullscreen button clicked');
      e.preventDefault();
      e.stopPropagation();
      enterFullscreen();
    });
    
    exitFullscreenBtn.addEventListener('click', (e) => {
      console.log('Exit fullscreen button clicked');
      e.preventDefault();
      e.stopPropagation();
      exitFullscreen();
    });

    function enterFullscreen() {
      console.log('Entering fullscreen');
      const iframe = previewContainer.querySelector('iframe');
      if (!iframe) {
        console.log('No iframe found for fullscreen');
        return;
      }

  // Save styles
  originalStyles = {
    position: iframe.style.position,
    top: iframe.style.top,
    left: iframe.style.left,
    width: iframe.style.width,
    height: iframe.style.height,
    zIndex: iframe.style.zIndex,
    background: iframe.style.background
  };

  // Apply fake fullscreen
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.zIndex = '9999';
  iframe.style.background = '#000';

  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  exitFullscreenBtn.style.display = 'block';
  isFullscreen = true;
}

function exitFullscreen() {
  const iframe = previewContainer.querySelector('iframe');
  if (!iframe) return;

  // Restore styles
  for (let key in originalStyles) {
    iframe.style[key] = originalStyles[key];
  }

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  exitFullscreenBtn.style.display = 'none';
  isFullscreen = false;
}


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isFullscreen) {
    exitFullscreen();
  }
});

    addGameBtn.addEventListener('click', async () => {
      const Name = gameNameInput.value.trim();
      const Code = gameCodeInput.value.trim();
      const CategoryArray = Array.from(gameCategorySelect.selectedOptions).map(o => o.value).filter(Boolean);
      const Category = joinCategories(CategoryArray);

      if (!Name || !Code) {
        alert('Please fill in all required fields (Name and Code).');
        return;
      }
      
      // Disable button to prevent double-clicks
      addGameBtn.disabled = true;
      addGameBtn.textContent = 'Adding...';
      
      try {
        const { data, error } = await client
          .from('Files')
          .insert([{ Name, Code, Category }])
          .select();
          
        if (error) {
          console.error('Error adding game:', error);
          alert('Error saving game: ' + error.message);
          return;
        }
        
        alert('Game added successfully!');
        gameNameInput.value = '';
        Array.from(gameCategorySelect.options).forEach(opt => opt.selected = false);
        gameCodeInput.value = '';

        await loadGames();
        
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        // Re-enable button
        addGameBtn.disabled = false;
        addGameBtn.textContent = 'Add Game';
      }
    });

    // Use event delegation for category-buttons so dynamically added ones just work
    categoryButtonsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;
      filterByCategory(btn.dataset.category, btn);
    });

    // Search functionality
    searchInput.addEventListener('input', filterGames);

    function filterGames() {
      const term = searchInput.value.toLowerCase();
      const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || '';
      const filtered = allGames.filter(g => {
        const nameMatch = (g.Name || '').toLowerCase().includes(term);
        const categoryMatch = !activeCategory || splitCategories(g.Category).includes(activeCategory);
        return nameMatch && categoryMatch;
      });
      renderGameList(filtered);
    }
    
    // Admin panel event listeners
    closeAdminBtn.addEventListener('click', () => {
      adminPanel.style.display = 'none';
    });
    
    refreshGamesBtn.addEventListener('click', loadGames);
    
    testConnectionBtn.addEventListener('click', async () => {
      console.log('Manual connection test triggered...');
      const result = await testConnection();
      if (result) {
        alert('✅ Database connection successful! Check console for details.');
      } else {
        alert('❌ Database connection failed! Check console for error details.');
      }
    });
    
    exportGamesBtn.addEventListener('click', () => {
      const dataStr = JSON.stringify(allGames, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'games_export.json';
      link.click();
      URL.revokeObjectURL(url);
    });
    
    // Edit/Delete functionality
    editGamesBtn.addEventListener('click', () => {
      editGamesSection.style.display = editGamesSection.style.display === 'none' ? 'block' : 'none';
      editForm.style.display = 'none';
      gameSelect.value = '';
    });
    
    gameSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        loadGameForEdit(e.target.value);
      } else {
        editForm.style.display = 'none';
      }
    });
    
    updateGameBtn.addEventListener('click', updateGame);
    
    cancelEditBtn.addEventListener('click', () => {
      editForm.style.display = 'none';
      gameSelect.value = '';
    });

    const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const deleteConfirmMessage = document.getElementById('delete-confirm-message');

let gameIdToDelete = null;

deleteGameBtn.addEventListener('click', () => {
  const selectedId = gameSelect.value;
  if (!selectedId) {
    alert('Please select a game to delete.');
    return;
  }
  const gameName = allGames.find(g => g.id == selectedId)?.Name || 'this game';
  deleteConfirmMessage.textContent = `Are you sure you want to delete "${gameName}"? This action cannot be undone.`;
  gameIdToDelete = selectedId;
  deleteConfirmationModal.style.display = 'flex';
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!gameIdToDelete) return;
  try {
    const { error } = await client.from('Files').delete().eq('id', gameIdToDelete);
    if (error) {
      console.error('Error deleting game:', error);
      alert('Error deleting game: ' + error.message);
      return;
    }
    alert('Game deleted successfully!');
    gameIdToDelete = null;
    deleteConfirmationModal.style.display = 'none';
    editForm.style.display = 'none';
    editGamesSection.style.display = 'none';
    gameSelect.value = '';
    await loadGames();
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('An unexpected error occurred. Please try again.');
  }
});

cancelDeleteBtn.addEventListener('click', () => {
  gameIdToDelete = null;
  deleteConfirmationModal.style.display = 'none';
});

    // Close admin panel when clicking outside
    adminPanel.addEventListener('click', (e) => {
      if (e.target === adminPanel) {
        adminPanel.style.display = 'none';
      }
    });

    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'l') {
        passwordModal.style.display = 'block';
        passwordInput.focus();
      }
    });

    passwordInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (passwordInput.value === 'Alexander') {
          passwordModal.style.display = 'none';
          adminPanel.style.display = 'flex';
        } else {
          alert('Incorrect password.');
          passwordInput.value = '';
        }
      }
    });

    // ---- Matrix background (integrated with preferences) ----
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    let fontSize = 14;
    let columns = 0; let drops = [];

    function resizeCanvas(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    }

    function drawMatrix(){
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--matrix-color') || '#33ff33';
      ctx.font = fontSize + 'px Courier New';
      for(let i=0;i<drops.length;i++){
        const text = Math.random() > 0.5 ? '1' : '0';
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if(y > canvas.height && Math.random() > 0.975) drops[i] = 0; else drops[i]++;
      }
    }

    let matrixInterval = null;
    function resetMatrixInterval(){
      if(matrixInterval) clearInterval(matrixInterval);
      const speed = Math.max(1, Math.min(12, preferences.matrixSpeed || 6));
      const ms = Math.round(140 - (speed * 9));
      matrixInterval = setInterval(drawMatrix, ms);
    }

    window.addEventListener('resize', () => { resizeCanvas(); });

    // ---- Initialization flow ----
    async function initApp() {
      console.log('Initializing app...');
      const connectionOk = await testConnection();
      if (connectionOk) {
        await loadGames();
      } else {
        gameListDiv.innerHTML = '<div style="color: #ff3333; text-align: center; padding: 20px;">⚠️ Database connection failed. Check console for details.</div>';
      }
    }

    // =========== Settings/preferences system ===========
    let preferences = {
      theme: 'matrix',
      matrixSpeed: 6,
      matrixColor: '#33ff33',
      cardSize: 'medium',
      animations: true,
      sfx: true,
      bgMusic: 'none',
      showFavorites: true,
      showRecent: true,
      trackPlaytime: true,
      offlineMode: false,
      preloadGames: false
    };
    let currentUserId = null;
    
    // =========== Gameplay data ===========
    let favorites = new Set();
    let recentGames = [];
    let gameStats = {}; // { gameId: { playCount: 0, totalTime: 0 } }
    let currentSession = { gameId: null, startTime: null };
    let sessionTimer = null;
    
    // =========== Sound Effects ===========
    const sounds = {
      click: () => playTone(400, 0.1, 0.02),
      hover: () => playTone(200, 0.02, 0.002),
      success: () => playTone(1000, 0.2, 0.1),
      error: () => playTone(400, 0.3, 0.15)
    };
    
    function playTone(frequency, duration, volume = 0.1) {
      if (!preferences.sfx) return;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }
    
    // =========== Favorites System ===========
    function toggleFavorite(gameId) {
      if (favorites.has(gameId)) {
        favorites.delete(gameId);
        sounds.click();
      } else {
        favorites.add(gameId);
        sounds.success();
      }
      saveFavorites();
      updateFavoritesDisplay();
      updateGameButtons();
    }
    
    function saveFavorites() {
      localStorage.setItem('game_favorites', JSON.stringify([...favorites]));
    }
    
    function loadFavorites() {
      try {
        const saved = localStorage.getItem('game_favorites');
        if (saved) {
          favorites = new Set(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Failed to load favorites:', e);
      }
    }
    
    function updateFavoritesDisplay() {
      const favGames = allGames.filter(g => favorites.has(g.id));
      favoritesCount.textContent = `(${favGames.length})`;
      
      if (preferences.showFavorites && favGames.length > 0) {
        favoritesSection.style.display = 'block';
        favoritesList.innerHTML = '';
        favGames.forEach(game => {
          const btn = createGameButton(game, true);
          favoritesList.appendChild(btn);
        });
      } else {
        favoritesSection.style.display = 'none';
      }
    }
    
    // =========== Recent Games System ===========
    function addToRecent(gameId) {
      if (!preferences.trackPlaytime) return;
      
      // Remove if already exists
      recentGames = recentGames.filter(id => id !== gameId);
      // Add to front
      recentGames.unshift(gameId);
      // Keep only last 8
      recentGames = recentGames.slice(0, 8);
      
      saveRecentGames();
      updateRecentDisplay();
    }
    
    function saveRecentGames() {
      localStorage.setItem('recent_games', JSON.stringify(recentGames));
    }
    
    function loadRecentGames() {
      try {
        const saved = localStorage.getItem('recent_games');
        if (saved) {
          recentGames = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load recent games:', e);
      }
    }
    
    function updateRecentDisplay() {
      const recentGameData = recentGames.map(id => allGames.find(g => g.id === id)).filter(Boolean);
      recentCount.textContent = `(${recentGameData.length})`;
      
      if (preferences.showRecent && recentGameData.length > 0) {
        recentSection.style.display = 'block';
        recentList.innerHTML = '';
        recentGameData.forEach(game => {
          const btn = createGameButton(game, true);
          btn.style.opacity = '0.8';
          recentList.appendChild(btn);
        });
      } else {
        recentSection.style.display = 'none';
      }
    }
    
    // =========== Session Tracking ===========
    function startSession(gameId, gameName) {
      if (!preferences.trackPlaytime) return;
      
      // End previous session
      endSession();
      
      currentSession = { gameId, startTime: Date.now() };
      sessionGame.textContent = gameName || 'Unknown Game';
      sessionInfo.style.display = 'block';
      
      sessionTimer = setInterval(updateSessionDisplay, 1000);
      addToRecent(gameId);
    }
    
    function endSession() {
      if (currentSession.gameId && currentSession.startTime) {
        const duration = Date.now() - currentSession.startTime;
        updateGameStats(currentSession.gameId, duration);
      }
      
      currentSession = { gameId: null, startTime: null };
      sessionInfo.style.display = 'none';
      
      if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
      }
    }
    
    function updateSessionDisplay() {
      if (!currentSession.startTime) return;
      
      const elapsed = Date.now() - currentSession.startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      sessionTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function updateGameStats(gameId, duration) {
      if (!gameStats[gameId]) {
        gameStats[gameId] = { playCount: 0, totalTime: 0 };
      }
      
      gameStats[gameId].playCount++;
      gameStats[gameId].totalTime += duration;
      
      saveGameStats();
    }
    
    function saveGameStats() {
      localStorage.setItem('game_stats', JSON.stringify(gameStats));
    }
    
    function loadGameStats() {
      try {
        const saved = localStorage.getItem('game_stats');
        if (saved) {
          gameStats = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load game stats:', e);
      }
    }
    
    // =========== Login System ===========
    async function showLoginModal() {
      loginModal.style.display = 'flex';
      loginEmail.focus();
      loginStatus.textContent = '';
    }
    
    async function hideLoginModal() {
      loginModal.style.display = 'none';
      loginEmail.value = '';
      loginPassword.value = '';
      loginStatus.textContent = '';
    }
    
    async function handleLogin() {
      const email = loginEmail.value.trim();
      const password = loginPassword.value;
      
      if (!email || !password) {
        loginStatus.textContent = 'Please enter both email and password.';
        loginStatus.style.color = '#ff3333';
        return;
      }
      
      loginStatus.textContent = 'Signing in...';
      loginStatus.style.color = 'var(--muted)';
      
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email,
          password: password
        });
        
        if (error) {
          throw error;
        }
        
        loginStatus.textContent = 'Login successful!';
        loginStatus.style.color = 'var(--accent)';
        
        updateUserInterface(data.user);
        cacheAccountLocally(data.user);
        await ensureProfileRow(data.user, { username: data.user.user_metadata?.username || null });
        hideLoginModal();
        await promptForMissingUsername();
        await loadPreferences(); // Reload preferences from cloud
        
      } catch (error) {
        console.error('Login error:', error);
        loginStatus.textContent = error.message || 'Login failed. Please try again.';
        loginStatus.style.color = '#ff3333';
      }
    }
    
    async function handleSignup() {
      const email = loginEmail.value.trim();
      const password = loginPassword.value;
      const username = (loginUsername.value || '').trim();
      
      if (!email || !password) {
        loginStatus.textContent = 'Please enter both email and password.';
        loginStatus.style.color = '#ff3333';
        return;
      }
      
      if (password.length < 6) {
        loginStatus.textContent = 'Password must be at least 6 characters.';
        loginStatus.style.color = '#ff3333';
        return;
      }
      
      loginStatus.textContent = 'Creating account...';
      loginStatus.style.color = 'var(--muted)';
      
      try {
        const { data, error } = await client.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { username: username || null }
          }
        });
        
        if (error) {
          throw error;
        }
        
        if (data.user) {
          await ensureProfileRow(data.user, { username: username || null });
          cacheAccountLocally(data.user, { email, username });
          updateUserInterface(data.user);
          hideLoginModal();
          loginStatus.textContent = 'Account created! Check your email to verify.';
          loginStatus.style.color = 'var(--accent)';
        } else {
          loginStatus.textContent = 'Check your email to verify your account.';
          loginStatus.style.color = 'var(--accent)';
        }
        
      } catch (error) {
        console.error('Signup error:', error);
        loginStatus.textContent = error.message || 'Signup failed. Please try again.';
        loginStatus.style.color = '#ff3333';
      }
    }
    
    async function handleLogout() {
      try {
        const { error } = await client.auth.signOut();
        if (error) throw error;
        
        updateUserInterface(null);
        currentUserId = null;
        cacheAccountLocally(null);
        
      } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
      }
    }
    
    function cacheAccountLocally(user, override = {}) {
      try {
        if (!user) {
          localStorage.removeItem('launcher_user');
          return;
        }

        const localUser = {
          id: user.id,
          email: override.email || user.email,
          username: override.username || user.user_metadata?.username || null,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem('launcher_user', JSON.stringify(localUser));
      } catch (err) {
        console.warn('Failed to cache account locally:', err);
      }
    }

    async function refreshLocalAccount() {
      try {
        const { data } = await client.auth.getUser();
        if (data?.user) {
          cacheAccountLocally(data.user);
        } else {
          localStorage.removeItem('launcher_user');
        }
      } catch (err) {
        console.warn('Failed to refresh local account:', err);
      }
    }

    async function ensureProfileRow(user, metadata = {}) {
      if (!user?.id) return;
      try {
        const { error } = await client.from('user_profiles').upsert({
          id: user.id,
          username: metadata.username || user.user_metadata?.username || null,
          display_name: metadata.display_name || metadata.username || user.email || 'User'
        }, { onConflict: ['id'] });
        if (error) {
          console.error('Failed to upsert user profile:', error);
        }
      } catch (err) {
        console.error('ensureProfileRow error:', err);
      }
    }

    function updateUserInterface(user) {
      if (user) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        const metaName = user.user_metadata?.username || user.email || 'User';
        userName.textContent = metaName;
      } else {
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        userName.textContent = '';
      }
    }

    // =========== Enhanced Game Button Creation ===========
    function createGameButton(game, isCompact = false) {
      const button = document.createElement('button');
      button.className = 'game-button';
      button.style.position = 'relative';
      
      const stats = gameStats[game.id];
      const isFavorite = favorites.has(game.id);
      
      let innerHTML = game.Name || 'Untitled';
      
      if (stats && preferences.trackPlaytime && !isCompact) {
        const hours = Math.floor(stats.totalTime / 3600000);
        const minutes = Math.floor((stats.totalTime % 3600000) / 60000);
        const plays = stats.playCount;
        let timeStr = '';
        if (hours > 0) timeStr = `${hours}h`;
        else if (minutes > 0) timeStr = `${minutes}m`;
        
        innerHTML += `<div style="font-size:10px;color:var(--muted);margin-top:4px;">
          ${plays} plays${timeStr ? `, ${timeStr}` : ''}
        </div>`;
      }
      
      button.innerHTML = innerHTML;
      
      // Add favorite star
      const star = document.createElement('button');
      star.innerHTML = isFavorite ? '★' : '☆';
      star.className = 'favorite-btn';
      star.style.cssText = `
        position:absolute; top:4px; right:4px; background:none; border:none; 
        color:${isFavorite ? '#ffff00' : 'var(--muted)'}; font-size:16px; cursor:pointer;
        padding:2px; transition:color 0.2s ease; z-index:2;
      `;
      
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(game.id);
        sounds.click();
      });
      
      button.appendChild(star);
      
      button.addEventListener('mouseenter', () => sounds.hover());
      
      button.addEventListener('click', () => {
        console.log('Game button clicked:', game.Name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        codeInput.value = game.Code || '';
        runCode();
        startSession(game.id, game.Name);
        sounds.success();
      });
      
      return button;
    }

    async function promptForMissingUsername() {
      try {
        const { data: userData } = await client.auth.getUser();
        const user = userData?.user;
        if (!user) return;
        const current = user.user_metadata?.username;
        if (current && current.trim().length > 0) return;
        const proposed = prompt('Choose a username to use in chat:');
        if (!proposed || !proposed.trim()) return;
        const { data, error } = await client.auth.updateUser({ data: { username: proposed.trim() } });
        if (!error) {
          updateUserInterface(data.user || user);
        }
      } catch (e) {
        console.warn('Username prompt failed:', e);
      }
    }

    async function loadPreferences(){
      try{
        const { data: authData } = await client.auth.getUser();
        currentUserId = authData?.user?.id || null;
      }catch(e){ console.warn('Auth fetch failed', e); currentUserId = null; }

      if(currentUserId){
        try{
          const { data, error } = await client.from('user_preferences').select('*').eq('user_id', currentUserId).single();
          if(error){ console.log('No remote prefs row (or error):', error?.message); loadPrefsFromLocal(); }
          else if(data){
            preferences = Object.assign(preferences, {
              theme: data.theme || preferences.theme,
              matrixSpeed: data.matrix_speed || preferences.matrixSpeed,
              matrixColor: data.matrix_color || preferences.matrixColor,
              cardSize: data.card_size || preferences.cardSize,
              animations: typeof data.animations_enabled === 'boolean' ? data.animations_enabled : preferences.animations,
              sfx: typeof data.sfx_enabled === 'boolean' ? data.sfx_enabled : preferences.sfx,
              bgMusic: data.bg_music || preferences.bgMusic,
              showFavorites: typeof data.show_favorites === 'boolean' ? data.show_favorites : preferences.showFavorites,
              showRecent: typeof data.show_recent === 'boolean' ? data.show_recent : preferences.showRecent,
              trackPlaytime: typeof data.track_playtime === 'boolean' ? data.track_playtime : preferences.trackPlaytime,
              offlineMode: typeof data.offline_mode === 'boolean' ? data.offline_mode : preferences.offlineMode,
              preloadGames: typeof data.preload_games === 'boolean' ? data.preload_games : preferences.preloadGames
            });
            applyTheme(preferences);
            updatePrefStatus(true);
          }
        }catch(err){ console.error('Failed to load prefs from supabase', err); loadPrefsFromLocal(); }
      }else{
        loadPrefsFromLocal();
      }
    }

    function loadPrefsFromLocal(){
      try{
        const raw = localStorage.getItem('launcher_prefs');
        if(raw){ const obj = JSON.parse(raw); preferences = Object.assign(preferences, obj); }
      }catch(e){console.warn('local load failed', e)}
      applyTheme(preferences);
      updatePrefStatus(false);
    }

    function updatePrefStatus(savedRemote){ if(savedRemote){ prefSaveStatus.textContent = 'Preferences loaded from cloud (Supabase).'; } else prefSaveStatus.textContent = 'Using local preferences. Sign in to save to cloud.'; }

    async function savePreferences(){
      const payload = {
        theme: preferences.theme,
        matrix_speed: preferences.matrixSpeed,
        matrix_color: preferences.matrixColor,
        card_size: preferences.cardSize,
        animations_enabled: preferences.animations,
        sfx_enabled: preferences.sfx,
        bg_music: preferences.bgMusic,
        show_favorites: preferences.showFavorites,
        show_recent: preferences.showRecent,
        track_playtime: preferences.trackPlaytime,
        offline_mode: preferences.offlineMode,
        preload_games: preferences.preloadGames
      };

      if(currentUserId){
        try{
          const row = Object.assign({user_id: currentUserId}, payload);
          const { error } = await client.from('user_preferences').upsert(row, {onConflict:['user_id']});
          if(error){ console.error('Save prefs error', error); prefSaveStatus.textContent = 'Failed to save to cloud.'; }
          else prefSaveStatus.textContent = 'Preferences saved to cloud.';
        }catch(err){ console.error('Save prefs catch', err); prefSaveStatus.textContent = 'Save error.' }
      }else{
        try{ localStorage.setItem('launcher_prefs', JSON.stringify(preferences)); prefSaveStatus.textContent = 'Preferences saved locally.' }catch(e){ console.warn('local save failed', e); prefSaveStatus.textContent = 'Save failed.' }
      }
    }

    let saveTimer = null;
    function savePreferencesDebounced(){ clearTimeout(saveTimer); saveTimer = setTimeout(savePreferences, 600); }

    // Apply theme to page
    function applyTheme(prefs){
      document.documentElement.classList.remove('theme-crt','theme-neon','theme-pixel','theme-stealth');
      if(prefs.theme === 'crt') document.documentElement.classList.add('theme-crt');
      if(prefs.theme === 'neon') document.documentElement.classList.add('theme-neon');
      if(prefs.theme === 'pixel') document.documentElement.classList.add('theme-pixel');
      if(prefs.theme === 'stealth') document.documentElement.classList.add('theme-stealth');

      if(prefs.theme === 'matrix'){
        document.documentElement.style.setProperty('--matrix-color', prefs.matrixColor || '#33ff33');
        matrixColor.value = prefs.matrixColor || '#33ff33';
        matrixSpeed.value = prefs.matrixSpeed || 6;
      }

      if(prefs.animations) document.documentElement.classList.remove('no-animations'); else document.documentElement.classList.add('no-animations');

      document.documentElement.style.setProperty('--card-size', prefs.cardSize || 'medium');
      const gs = document.querySelectorAll('.game-button');
      gs.forEach(g => {
        if(prefs.cardSize === 'small'){ g.style.padding = '8px'; g.style.fontSize='12px'; }
        else if(prefs.cardSize === 'large'){ g.style.padding='20px'; g.style.fontSize='16px'; }
        else { g.style.padding='15px'; g.style.fontSize='14px'; }
      });

      bgMusicSelect.value = prefs.bgMusic || 'none';
      toggleSfx.checked = !!prefs.sfx;
      toggleAnimations.checked = !!prefs.animations;
      cardSize.value = prefs.cardSize || 'medium';
      
      // Update new gameplay controls
      showFavorites.checked = !!prefs.showFavorites;
      showRecent.checked = !!prefs.showRecent;
      trackPlaytime.checked = !!prefs.trackPlaytime;
      offlineMode.checked = !!prefs.offlineMode;
      preloadGames.checked = !!prefs.preloadGames;
    }

    // Wire controls
    matrixSpeed.addEventListener('input', (e)=>{ preferences.matrixSpeed = Number(e.target.value); applyTheme(preferences); savePreferencesDebounced(); resetMatrixInterval(); });
    matrixColor.addEventListener('input', (e)=>{ preferences.matrixColor = e.target.value; document.documentElement.style.setProperty('--matrix-color', preferences.matrixColor); applyTheme(preferences); savePreferencesDebounced(); });
    cardSize.addEventListener('change', (e)=>{ preferences.cardSize = e.target.value; applyTheme(preferences); savePreferencesDebounced(); });
    toggleAnimations.addEventListener('change', (e)=>{ preferences.animations = e.target.checked; applyTheme(preferences); savePreferencesDebounced(); });
    toggleSfx.addEventListener('change', (e)=>{ preferences.sfx = e.target.checked; savePreferencesDebounced(); });
    bgMusicSelect.addEventListener('change', (e)=>{ preferences.bgMusic = e.target.value; savePreferencesDebounced(); updateBackgroundMusic(); });

    // New gameplay feature controls
    showFavorites.addEventListener('change', (e) => { 
      preferences.showFavorites = e.target.checked; 
      savePreferencesDebounced(); 
      updateFavoritesDisplay(); 
    });
    showRecent.addEventListener('change', (e) => { 
      preferences.showRecent = e.target.checked; 
      savePreferencesDebounced(); 
      updateRecentDisplay(); 
    });
    trackPlaytime.addEventListener('change', (e) => { 
      preferences.trackPlaytime = e.target.checked; 
      savePreferencesDebounced(); 
      if (!e.target.checked) {
        endSession();
      }
    });
    
    clearRecentBtn.addEventListener('click', () => {
      if (confirm('Clear recently played games?')) {
        recentGames = [];
        saveRecentGames();
        updateRecentDisplay();
        sounds.success();
      }
    });
    
    clearFavoritesBtn.addEventListener('click', () => {
      if (confirm('Clear all favorites?')) {
        favorites.clear();
        saveFavorites();
        updateFavoritesDisplay();
        updateGameButtons();
        sounds.success();
      }
    });
    
    offlineMode.addEventListener('change', (e) => { 
      preferences.offlineMode = e.target.checked; 
      savePreferencesDebounced();
      updateCacheStatus();
    });
    
    preloadGames.addEventListener('change', (e) => { 
      preferences.preloadGames = e.target.checked; 
      savePreferencesDebounced();
      if (e.target.checked) {
        preloadSelectedGames();
      }
    });
    
    clearCacheBtn.addEventListener('click', () => {
      if (confirm('Clear all cached data?')) {
        clearGameCache();
        sounds.success();
      }
    });
    
    // Login event listeners
    loginBtn.addEventListener('click', showLoginModal);
    loginSubmitBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignup);
    loginCancelBtn.addEventListener('click', hideLoginModal);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Enter key support for login
    loginEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loginPassword.focus();
    });
    loginPassword.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });

    // Swatch selection
    swatches.forEach(s => s.addEventListener('click', () => { selectTheme(s.dataset.theme); }));
    function selectTheme(theme){ document.querySelectorAll('.swatch').forEach(w => w.classList.remove('selected')); const el = document.querySelector(`.swatch[data-theme='${theme}']`); if(el) el.classList.add('selected'); matrixControls.style.display = theme === 'matrix' ? 'block' : 'none'; preferences.theme = theme; applyTheme(preferences); savePreferencesDebounced(); }

    function markSelectedSwatch(){ document.querySelectorAll('.swatch').forEach(w=>w.classList.remove('selected')); const el = document.querySelector(`.swatch[data-theme='${preferences.theme}']`); if(el) el.classList.add('selected'); matrixControls.style.display = preferences.theme === 'matrix' ? 'block' : 'none'; }

    // Settings panel open/close
    function openSettings(){ settingsOverlay.style.display = 'block'; settingsPanel.classList.add('open'); settingsPanel.setAttribute('aria-hidden','false'); }
    function closeSettingsFn(){ settingsOverlay.style.display = 'none'; settingsPanel.classList.remove('open'); settingsPanel.setAttribute('aria-hidden','true'); }
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsFn);
    settingsOverlay.addEventListener('click', closeSettingsFn);

    // =========== Cache Management ===========
    function updateCacheStatus() {
      if (preferences.offlineMode) {
        cacheStatus.textContent = 'Enabled';
        cacheStatus.style.color = 'var(--accent)';
      } else {
        cacheStatus.textContent = 'Disabled';
        cacheStatus.style.color = 'var(--muted)';
      }
    }
    
    function preloadSelectedGames() {
      // Preload favorite games and recent games when offline mode is enabled
      if (!preferences.preloadGames) return;
      
      const gamesToPreload = [...favorites, ...recentGames.slice(0, 5)];
      let cached = 0;
      
      gamesToPreload.forEach(gameId => {
        const game = allGames.find(g => g.id === gameId);
        if (game && game.Code) {
          try {
            localStorage.setItem(`cached_game_${gameId}`, JSON.stringify({
              id: game.id,
              name: game.Name,
              code: game.Code,
              category: game.Category,
              timestamp: Date.now()
            }));
            cached++;
          } catch (e) {
            console.warn('Failed to cache game:', game.Name, e);
          }
        }
      });
      
      if (cached > 0) {
        cacheStatus.textContent = `${cached} games cached`;
        cacheStatus.style.color = 'var(--accent)';
      }
    }
    
    function clearGameCache() {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cached_game_'));
      keys.forEach(key => localStorage.removeItem(key));
      updateCacheStatus();
    }
    
    // Background music stub
    let musicAudio = null;
    function updateBackgroundMusic(){ 
      if(musicAudio){ 
        musicAudio.pause(); 
        musicAudio = null; 
      } 
      if(preferences.bgMusic === 'none') return; 
      
      // Simple ambient sound implementation
      if (preferences.bgMusic === 'ambient1' && preferences.sfx) {
        // Create a subtle ambient loop using Web Audio API
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator1 = audioContext.createOscillator();
          const oscillator2 = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator1.connect(gainNode);
          oscillator2.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator1.frequency.value = 220;
          oscillator2.frequency.value = 330;
          oscillator1.type = 'sine';
          oscillator2.type = 'sine';
          
          gainNode.gain.value = 0.02; // Very quiet
          
          oscillator1.start();
          oscillator2.start();
          
          // Stop after 30 seconds to avoid continuous playing
          setTimeout(() => {
            try {
              oscillator1.stop();
              oscillator2.stop();
            } catch(e) {}
          }, 30000);
        } catch (e) {
          console.warn('Background music failed:', e);
        }
      }
    }

    // Category add UI
    showAddCategoryBtn.addEventListener('click', () => { if (newCategoryContainer.style.display === 'none' || newCategoryContainer.style.display === '') { newCategoryContainer.style.display = 'block'; newCategoryInput.focus(); } else { newCategoryContainer.style.display = 'none'; } });

    addCategoryBtn.addEventListener('click', () => {
      const newCat = newCategoryInput.value.trim();
      if (newCat === '') { alert('Please enter a category name.'); return; }
      const allOptions = Array.from(gameCategorySelect.options).map(o => o.value.toLowerCase());
      if (allOptions.includes(newCat.toLowerCase())) { alert('Category already exists.'); newCategoryInput.value = ''; newCategoryInput.focus(); return; }
      const optionA = document.createElement('option'); optionA.value = newCat; optionA.textContent = newCat; gameCategorySelect.appendChild(optionA);
      const optionB = document.createElement('option'); optionB.value = newCat; optionB.textContent = newCat; editGameCategorySelect.appendChild(optionB);
      const existingBtn = Array.from(document.querySelectorAll('.category-btn')).find(b => b.dataset.category.toLowerCase() === newCat.toLowerCase());
      if (!existingBtn) { const btn = document.createElement('button'); btn.className = 'category-btn'; btn.dataset.category = newCat; btn.textContent = newCat; categoryButtonsContainer.appendChild(btn); }
      optionA.selected = true; newCategoryContainer.style.display = 'none'; newCategoryInput.value = '';
    });

    // Delete modal handling already wired earlier

    // Init sequence that loads prefs, then app
    async function init() {
      console.log('Initializing app...');
      
      // Check authentication state first
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          updateUserInterface(session.user);
          currentUserId = session.user.id;
        }
      } catch (error) {
        console.warn('Auth session check failed:', error);
      }
      
      await loadPreferences();
      loadFavorites();
      loadRecentGames();
      loadGameStats();
      markSelectedSwatch();
      resizeCanvas();
      resetMatrixInterval();
      updateBackgroundMusic();
      updateCacheStatus();
      await initApp();
      
      console.log('App initialization complete');
      
      // Add sound effects to existing buttons
      document.querySelectorAll('button').forEach(btn => {
        if (!btn.classList.contains('favorite-btn')) {
          btn.addEventListener('mouseenter', () => sounds.hover());
          btn.addEventListener('click', () => sounds.click());
        }
      });
    }

    init();
    
    // Listen for auth state changes
    client.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (event === 'SIGNED_IN' && session?.user) {
        updateUserInterface(session.user);
        currentUserId = session.user.id;
        cacheAccountLocally(session.user);
        await ensureProfileRow(session.user, { username: session.user.user_metadata?.username || null });
        await promptForMissingUsername();
        loadPreferences(); // Reload preferences from cloud
      } else if (event === 'SIGNED_OUT') {
        updateUserInterface(null);
        currentUserId = null;
        cacheAccountLocally(null);
      }
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      endSession();
    });
    
    // Ensure simple run behavior like Untitled-1 (remove session wrapper)
    // Removed override that wrapped runCode with endSession to avoid interference

    // Accessibility: close settings with Escape
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ closeSettingsFn(); } });

  


    (function(){
      const KEY='tos_status';
      const overlay=document.getElementById('tos-overlay');
      const stored=localStorage.getItem(KEY);
      if(stored!=='hide'){ overlay.style.display='block'; }
      const close=()=>overlay.style.display='none';
      document.getElementById('btn-hide').onclick=()=>{ localStorage.setItem(KEY,'hide'); close(); };
      document.getElementById('btn-agree').onclick=()=>{ localStorage.setItem(KEY,'agreed:'+Date.now()); close(); };
      // Matrix rain effect for overlay only
      const c=document.querySelector('#tos-overlay #rain'),ctx=c.getContext('2d');let cols,drops;
      function size(){ c.width=innerWidth; c.height=innerHeight; cols=Math.floor(c.width/14); drops=Array(cols).fill(0); }
      size(); onresize=size;
      function draw(){
        ctx.fillStyle='rgba(7,17,10,0.08)'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle='#28ff7a'; ctx.font='14px monospace';
        for(let i=0;i<drops.length;i++){
          ctx.fillText('01'[Math.random()>0.5?1:0], i*14, drops[i]*14);
          if(drops[i]*14>c.height && Math.random()>0.975) drops[i]=0; drops[i]++;
        }
        requestAnimationFrame(draw);
      }
      draw();
    })();
