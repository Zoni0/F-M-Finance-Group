function aggiungiDipendente() {
    let nome = document.getElementById("nome").value;
    let ruolo = document.getElementById("ruolo").value;
    let paga = document.getElementById("paga").value;
    let ore = document.getElementById("ore").value;

    if (nome === "" || ruolo === "" || paga === "" || ore === "") {
        alert("Compila tutti i campi!");
        return;
    }

    let tabella = document.querySelector(".personale-table tbody");

    let nuovaRiga = document.createElement("tr");

    nuovaRiga.innerHTML = `
        <td>${nome}</td>
        <td>${ruolo}</td>
        <td>€ ${parseFloat(paga).toFixed(2)}</td>
        <td>${ore} ore/settimana</td>
        <td><button onclick="rimuoviDipendente(this, ${parseFloat(paga)})">❌</button></td>
    `;

    tabella.appendChild(nuovaRiga);

    // Aggiungi il movimento nelle uscite aziendali
    aggiungiMovimentoAziendale(nome, parseFloat(paga));

    // Reset dei campi
    document.getElementById("nome").value = "";
    document.getElementById("ruolo").value = "";
    document.getElementById("paga").value = "";
    document.getElementById("ore").value = "";
}

// Funzione per aggiungere l'uscita nei movimenti aziendali
function aggiungiMovimentoAziendale(nome, paga) {
    let movements = JSON.parse(localStorage.getItem("movements")) || [];

    let movimento = {
        date: new Date().toISOString().split('T')[0], // Data odierna in formato YYYY-MM-DD
        description: `Stipendio: ${nome}`,
        type: "uscita",
        amount: paga
    };

    movements.push(movimento);
    localStorage.setItem("movements", JSON.stringify(movements));

    if (typeof updateGraph === "function") {
        updateGraph(); // Aggiorna il grafico se presente
    }
}

function rimuoviDipendente(bottone, paga) {
    bottone.parentElement.parentElement.remove();
    
    // Opzionale: Rimuovere il movimento dalle uscite se un dipendente viene rimosso
    let movements = JSON.parse(localStorage.getItem("movements")) || [];
    let newMovements = movements.filter(m => !(m.description.startsWith("Stipendio") && m.amount === paga));

    localStorage.setItem("movements", JSON.stringify(newMovements));

    if (typeof updateGraph === "function") {
        updateGraph(); // Aggiorna il grafico se presente
    }
}
