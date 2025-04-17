document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM completamente caricato");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const welcomeMessage = document.getElementById("welcome-message");
    const logoutButton = document.getElementById("logout-button");

    if (!loginLink || !registerLink || !welcomeMessage || !logoutButton) {
        console.error("Elementi login-link, register-link, welcome-message o logout-button mancanti nel DOM.");
        return;
    }

    console.log("Utente loggato:", loggedInUser);

    if (loggedInUser) {
        // Nascondi i link di login e registrazione
        loginLink.style.display = "none";
        registerLink.style.display = "none";

        // Mostra il messaggio di benvenuto e il pulsante di logout
        welcomeMessage.textContent = `Benvenuto, ${loggedInUser.email}`;
        logoutButton.style.display = "inline-block";
    } else {
        // Mostra i link di login e registrazione
        loginLink.style.display = "block";
        registerLink.style.display = "block";

        // Nascondi il messaggio di benvenuto e il pulsante di logout
        welcomeMessage.textContent = "";
        logoutButton.style.display = "none";
    }
});

function logout() {
    console.log("Logout eseguito");
    localStorage.removeItem("loggedInUser"); // Rimuove l'utente loggato
    window.location.href = "Gestione_banca.html"; // Reindirizza alla pagina di login
}