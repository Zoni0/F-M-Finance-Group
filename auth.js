function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const name = document.getElementById("name").value.trim(); 
    const message = document.getElementById("message");

    if (username === "" || email === "" || password === "" || confirmPassword === "" || name === "") {
        message.textContent = "Tutti i campi sono obbligatori!";
        return;
    }

    if (!validateEmail(email)) {
        message.textContent = "Inserisci un'email valida!";
        return;
    }

    if (password.length < 5) {
        message.textContent = "La password deve essere di almeno 5 caratteri!";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Le password non coincidono!";
        return;
    }

    if (localStorage.getItem(username)) {
        message.textContent = "Questo username è già registrato!";
        return;
    }

    // Salvataggio utente nel localStorage con il nome
    const userData = { email, password, name }; 
    localStorage.setItem(username, JSON.stringify(userData));

    message.style.color = "green";
    message.textContent = "Registrazione completata! Reindirizzamento...";

    // Reindirizza al login dopo 2 secondi
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
}


function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (email === "" || password === "") {
        errorMessage.textContent = "Inserisci email e password!";
        return;
    }

    let foundUser = null;
    for (let i = 0; i < localStorage.length; i++) {
        const username = localStorage.key(i);
        const userData = JSON.parse(localStorage.getItem(username));

        if (userData.email === email) {
            foundUser = userData;
            break;
        }
    }

    if (!foundUser) {
        errorMessage.textContent = "Email non trovata! Registrati prima.";
        return;
    }

    if (foundUser.password !== password) {
        errorMessage.textContent = "Password errata!";
        return;
    }

    errorMessage.style.color = "green";
    errorMessage.textContent = "Login riuscito! Reindirizzamento...";

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    setTimeout(() => {
        window.location.href = "Gestione_banca.html";
    }, 1000); 
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}