function aggiungiDipendente() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Devi essere loggato per aggiungere un dipendente.");
        return;
    }

    let nome = document.getElementById("nome").value;
    let ruolo = document.getElementById("ruolo").value;
    let paga = document.getElementById("paga").value;
    let ore = document.getElementById("ore").value;

    if (nome === "" || ruolo === "" || paga === "" || ore === "") {
        alert("Compila tutti i campi!");
        return;
    }

    const dipendente = { nome, ruolo, paga: parseFloat(paga), ore: parseInt(ore) };

    // Recupera i dipendenti salvati per l'utente loggato
    const userPersonnelKey = `personale_${loggedInUser.email}`;
    const personale = JSON.parse(localStorage.getItem(userPersonnelKey)) || [];

    // Aggiungi il nuovo dipendente
    personale.push(dipendente);

    // Salva i dipendenti aggiornati nel localStorage
    localStorage.setItem(userPersonnelKey, JSON.stringify(personale));

    // Aggiorna la tabella
    renderPersonale();

    // Resetta i campi del form
    document.getElementById("nome").value = "";
    document.getElementById("ruolo").value = "";
    document.getElementById("paga").value = "";
    document.getElementById("ore").value = "";
}

function renderPersonale() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Devi essere loggato per visualizzare i dipendenti.");
        return;
    }

    const userPersonnelKey = `personale_${loggedInUser.email}`;
    const personale = JSON.parse(localStorage.getItem(userPersonnelKey)) || [];

    const tabella = document.querySelector(".personale-table tbody");
    tabella.innerHTML = ""; // Svuota la tabella

    personale.forEach(dipendente => {
        const nuovaRiga = document.createElement("tr");
        nuovaRiga.innerHTML = `
            <td>${dipendente.nome}</td>
            <td>${dipendente.ruolo}</td>
            <td>€ ${dipendente.paga.toFixed(2)}</td>
            <td>${dipendente.ore} ore/settimana</td>
            <td>
                <button onclick="pagaDipendente('${dipendente.nome}', ${dipendente.paga})">💰 Paga</button>
                <button onclick="rimuoviDipendente('${dipendente.nome}')">❌</button>
            </td>
        `;
        tabella.appendChild(nuovaRiga);
    });
}

function pagaDipendente(nome, paga) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Devi essere loggato per registrare un pagamento.");
        return;
    }

    const movimento = {
        date: new Date().toISOString().split('T')[0],
        description: `Pagamento stipendio: ${nome}`,
        type: "uscita",
        amount: paga
    };

    const userMovementsKey = `movements_${loggedInUser.email}`;
    const movements = JSON.parse(localStorage.getItem(userMovementsKey)) || [];
    movements.push(movimento);
    localStorage.setItem(userMovementsKey, JSON.stringify(movements));

    if (typeof updateGraph === "function") {
        updateGraph();
    }

    alert(`Pagamento di € ${paga.toFixed(2)} registrato per ${nome}`);
}

function rimuoviDipendente(nome) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Devi essere loggato per rimuovere un dipendente.");
        return;
    }

    const userPersonnelKey = `personale_${loggedInUser.email}`;
    let personale = JSON.parse(localStorage.getItem(userPersonnelKey)) || [];

   
    personale = personale.filter(dipendente => dipendente.nome !== nome);

    // Salva i dipendenti aggiornati nel localStorage
    localStorage.setItem(userPersonnelKey, JSON.stringify(personale));

    
    renderPersonale(); // Aggiorna la tabella
}

// Carica i dipendenti al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
    renderPersonale();
});
