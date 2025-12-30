

function openSignup() {
    document.getElementById('signupModal').style.display = 'flex';
}

function openLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'none';
}
//NEECHE WALE SIGN UP OR LOGIN THK HN BS NAAAM SHOW NHI KRTE HELLO ADMIN WAGAIRA

// async function handleSignup() {
//   const name = document.getElementById('signupName').value;
//   const email = document.getElementById('signupEmail').value;
//   const password = document.getElementById('signupPassword').value;
//   const role = document.getElementById('signupRole').value.toLowerCase().trim();

//   if (!name || !email || !password || !role) {
//     alert('Fill all fields');
//     return;
//   }

//   try {
//     const response = await fetch('http://localhost:3000/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password, role })
//     });

//     const result = await response.json();
//     console.log(result); // ✅ check backend response

//     if (!response.ok || !result.token) {
//       alert(result.message || 'Signup failed');
//       return;
//     }

//     // Store JWT and user info
//     localStorage.setItem('token', result.token);
//     localStorage.setItem('name', result.user.name);
//     localStorage.setItem('role', result.user.role);

//     closeModal();

//     // Redirect based on role
//     if (role === 'admin') {
//       window.location.href = 'admin-dashboard.html';
//       window.addEventListener('DOMContentLoaded', () => {
//     const welcomeText = document.getElementById('welcomeText');
//     welcomeText.textContent = `Hello ${username}`;
//     welcomeText.style.display = 'block'; // show the text
// });
//     } else {
//       window.location.href = 'home.html';
//       window.addEventListener('DOMContentLoaded', () => {
//     const welcomeText = document.getElementById('welcomeText');
//     welcomeText.textContent = `Hello ${username}`;
//     welcomeText.style.display = 'block'; // show the text
// });

//     }


//   } catch (err) {
//     console.error(err);
//     alert('Server error during signup');
//   }
// }


// //Login handler
// async function handleLogin() {
//   const email = document.getElementById('loginEmail').value;
//   const password = document.getElementById('loginPassword').value;
//   const role = document.getElementById('loginRole').value.toLowerCase().trim();

//   const response = await fetch('http://localhost:3000/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password, role })
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     alert(result.message);
//     return;
//   }

//   // 🔐 STORE JWT HERE (THIS WAS MISSING)
//   localStorage.setItem('token', result.token);

//   alert('Login successful');
//   closeModal();
// }


// async function handleLogin() {
//   const email = document.getElementById('loginEmail').value;
//   const password = document.getElementById('loginPassword').value;
//   const role = document.getElementById('loginRole').value.toLowerCase().trim();

//   if (!email || !password || !role) {
//     alert("Fill all fields");
//     return;
//   }

//   try {
//     const response = await fetch('http://localhost:3000/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password, role })
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       alert(result.message);
//       return;
//     }

//     // ✅ STORE AUTH DATA
//     localStorage.setItem("token", result.token);
//     localStorage.setItem("role", result.user.role);
//     localStorage.setItem("name", result.user.name);

//     closeModal();

//     // ✅ REDIRECT BASED ON ROLE
//     if (result.user.role === "admin") {
//       window.location.href = "admin-dashboard.html";
//     } else {
//       window.location.href = "home.html";
//     }

//   } catch (err) {
//     alert("Login failed");
//     console.error(err);
//   }
// }


async function handleSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const role = document.getElementById('signupRole').value.toLowerCase().trim();

  if (!name || !email || !password || !role) {
    alert('Fill all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok || !result.token) {
      alert(result.message || 'Signup failed');
      return;
    }

    // Store JWT and username
    localStorage.setItem('token', result.token);
    localStorage.setItem('username', result.user.name);
    localStorage.setItem('role', result.user.role);

    closeModal();

    // Redirect only
    if (role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'home.html';
    }

  } catch (err) {
    console.error(err);
    alert('Server error during signup');
  }
}


async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const role = document.getElementById('loginRole').value.toLowerCase().trim();

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.message);
    return;
  }

  // Store JWT and username
  localStorage.setItem('token', result.token);
  localStorage.setItem('username', result.user.name);
  localStorage.setItem('role', result.user.role);

  alert('Login successful');
  closeModal();

  // Redirect based on role
  if (role === 'admin') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'home.html';
  }
}



// Show/hide buttons depending on login
function updateAuthUI() {
  const token = localStorage.getItem('token');
  if (token) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
  } else {
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('signupBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
  }
}

// Call this on page load
updateAuthUI();

// Logout function
async function handleLogout() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await response.json();

        alert(result.message); // "Logged out successfully"

        localStorage.removeItem('token');
        localStorage.removeItem('username'); // <-- add this line

        updateAuthUI();
    } catch (err) {
        console.error('Logout error:', err);
    }
}




//to dynamically show products:

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  if (token && name) {
    document.querySelector(".auth-buttons").innerHTML = `
      <span style="color:white; font-weight:bold;">
        Hello ${role === "admin" ? "Admin " : ""}${name}
      </span>
      <button onclick="logout()">Logout</button>
    `;
  }
});
async function logout() {
  const token = localStorage.getItem("token");

  try {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error("Logout DB update failed");
  }

  localStorage.clear();
  window.location.href = "home.html";
}



async function loadProducts() {
  const container = document.querySelector('.products');
  container.innerHTML = ''; // clear previous

  try {
    const res = await fetch('http://localhost:3000/products');
    const products = await res.json();

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>Price: $${product.price}</p>
        <button onclick="orderProduct(${product.product_id})">Order Now</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadProducts);

function orderProduct(id) {
  alert(`Order functionality not implemented yet. Product ID: ${id}`);
}
