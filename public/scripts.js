document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const addNoteBtn = document.getElementById('add-note-btn');
  
    loginBtn.addEventListener('click', () => {
      const username = prompt('Enter username');
      const password = prompt('Enter password');
      login(username, password);
    });
  
    registerBtn.addEventListener('click', () => {
      const username = prompt('Enter username');
      const password = prompt('Enter password');
      register(username, password);
    });
  
    addNoteBtn.addEventListener('click', () => {
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
      addNote({ title, content });
    });
  
    function login(username, password) {
      fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Logged in successfully');
            loadNotes();
          } else {
            alert('Login failed');
          }
        });
    }
  
    function register(username, password) {
      fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).then(res => res.json())
        .then(data => {
          if (data.message) {
            alert(data.message);
          } else {
            alert('Registration failed');
          }
        });
    }
  
    function addNote(note) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first');
        return;
      }
      fetch('/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(note)
      }).then(res => res.json())
        .then(data => {
          if (data._id) {
            alert('Note added successfully');
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            loadNotes();
          } else {
            alert('Failed to add note');
          }
        });
    }
  
    function loadNotes() {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      fetch('/notes', {
        headers: { 'Authorization': token }
      }).then(res => res.json())
        .then(data => {
          const notesContainer = document.getElementById('notes-container');
          notesContainer.innerHTML = '';
          data.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
              <h3>${note.title}</h3>
              <p>${note.content}</p>
            `;
            notesContainer.appendChild(noteElement);
          });
        });
    }
  
    loadNotes();
  });
  