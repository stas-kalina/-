// Реєстрація
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
    } else {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        document.getElementById('success-message').innerText = 'Registration successful!';
    }
});

// Логін
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        document.getElementById('login-message').innerText = 'Login successful!';

        const userResponse = await fetch(`https://dummyjson.com/users/${data.id}`);
        const userData = await userResponse.json();
        document.getElementById('user-info').innerHTML = `
      <img src="${userData.image}" alt="User Photo" />
      <p>${userData.firstName} ${userData.lastName}</p>
    `;
    } else {
        document.getElementById('login-message').innerText = 'Login failed!';
    }
});

// Камера
const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
});

document.getElementById('capture').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    localStorage.setItem('capturedImage', imageData);
});

// Читання CSV
window.electronAPI.readCSV();
window.electronAPI.onCSVData((event, data) => {
    console.log('CSV data:', data);
});

// Контекстне меню для відкриття камери
window.electronAPI.onOpenCamera(() => {
    document.getElementById('capture').click();
});

