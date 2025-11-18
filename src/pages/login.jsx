// In your Login.jsx
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    // Store both token and user
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect based on role
    if (response.data.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard'); // or wherever users go
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  }
};