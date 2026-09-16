'use strict';
(function () {
  const form = document.getElementById('loginForm');
  const errBox = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  const btnText = document.getElementById('loginBtnText');

  // If already logged in, go straight to the dashboard.
  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((d) => { if (d.success) window.location.href = '/admin'; })
    .catch(() => {});

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.classList.remove('show');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) { showError('Please enter both username and password.'); return; }

    btn.disabled = true;
    btnText.textContent = 'Signing in…';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/admin';
      } else {
        showError(data.error || 'Invalid login.');
        btn.disabled = false;
        btnText.textContent = 'Sign In';
      }
    } catch (err) {
      showError('Network error. Please try again.');
      btn.disabled = false;
      btnText.textContent = 'Sign In';
    }
  });

  function showError(msg) {
    errBox.textContent = msg;
    errBox.classList.add('show');
  }
})();
