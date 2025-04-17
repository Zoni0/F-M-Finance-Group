document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente caricato");

    const movementsTableBody = document.getElementById("movements-body");
    const movementForm = document.getElementById("movement-form");
    const dateInput = document.getElementById("date");

    let chartEntrateUscite = null; // Variabile per il grafico

    // Imposta la data massima per il campo data
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("max", today);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Effettua il login per visualizzare i movimenti.");
        return;
    }

    loadMovements(); // Carica i movimenti salvati e aggiorna i grafici

    movementForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const date = document.getElementById("date").value;
        const description = document.getElementById("description").value;
        const type = document.getElementById("type").value.toLowerCase().trim();
        const amount = parseFloat(document.getElementById("amount").value);

        if (date && description && (type === "entrata" || type === "uscita") && !isNaN(amount)) {
            addMovement(date, description, type, amount);
            movementForm.reset();
        } else {
            alert("Compila tutti i campi correttamente.");
        }
    });

    function addMovement(date, description, type, amount) {
        const movement = { date, description, type, amount };
        const userMovementsKey = `movements_${loggedInUser.email}`;
        const movements = JSON.parse(localStorage.getItem(userMovementsKey)) || [];
    
        // Aggiungi il nuovo movimento
        movements.push(movement);
    
        // Salva i movimenti aggiornati nel localStorage
        localStorage.setItem(userMovementsKey, JSON.stringify(movements));
    
        renderMovements();
        updateGraph();
    }

    function loadMovements() {
        renderMovements();
        updateGraph();
    }

    function renderMovements() {
        const userMovementsKey = `movements_${loggedInUser.email}`;
        const movements = JSON.parse(localStorage.getItem(userMovementsKey)) || [];
        movementsTableBody.innerHTML = "";

        movements.forEach((movement, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${movement.date}</td>
                <td>${movement.description}</td>
                <td>${movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}</td>
                <td>€ ${parseFloat(movement.amount).toFixed(2)}</td>
                <td><button onclick="removeMovement(${index})">❌</button></td>
            `;
            movementsTableBody.appendChild(row);
        });
    }

    window.removeMovement = function (index) {
        const userMovementsKey = `movements_${loggedInUser.email}`;
        let movements = JSON.parse(localStorage.getItem(userMovementsKey)) || [];
        movements.splice(index, 1);
        localStorage.setItem(userMovementsKey, JSON.stringify(movements));

        renderMovements();
        updateGraph();
    };

    window.exportMovementsToCSV = function () {
        console.log("Funzione exportMovementsToCSV richiamata");
    
        // Recupera tutti i movimenti dell'utente loggato dal localStorage
        const userMovementsKey = `movements_${loggedInUser.email}`;
        const movements = JSON.parse(localStorage.getItem(userMovementsKey)) || [];
        const rows = [["Data", "Descrizione", "Tipo", "Importo"]]; // Intestazioni del CSV
    
       // Itera su tutti i movimenti e aggiungili al CSV
    movements.forEach(movement => {
        rows.push([
            movement.date, //scritto così per fare in modo che il csv si sviluppi su più colonne
            movement.description, 
            movement.type.charAt(0).toUpperCase() + movement.type.slice(1), // Capitalizza il tipo
            `€ ${parseFloat(movement.amount).toFixed(2)}` // Formatta l'importo con il simbolo €
        ]);
    });
    
        // Converte i dati in formato CSV
        const csvContent = rows.map(row => row.join(",")).join("\n");
    
        // Crea un file scaricabile
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
    
        // Crea un link per il download
        const a = document.createElement("a");
        a.href = url;
        a.download = "Movimenti.csv";
        a.click();
    
        // Rilascia l'oggetto URL
        URL.revokeObjectURL(url);
    };
   
   // funz per visualizzare il grafico delle entrate e uscite

    function updateGraph() {
        const userMovementsKey = `movements_${loggedInUser.email}`;
        const movements = JSON.parse(localStorage.getItem(userMovementsKey)) || [];
        
        const labels = [];
        const entrate = [];
        const uscite = [];

        // Organizza i dati per il grafico
        movements.forEach(movimento => {
            labels.push(movimento.date); // Aggiunge la data come etichetta
            if (movimento.type === "entrata") {
                entrate.push(movimento.amount);
                uscite.push(0); // Nessuna uscita per questa data
            } else if (movimento.type === "uscita") {
                uscite.push(movimento.amount);
                entrate.push(0); // Nessuna entrata per questa data
            }
        });

        // Distruggi il grafico precedente se esiste
        if (chartEntrateUscite) {
            chartEntrateUscite.destroy();
        }

        // Crea il nuovo grafico a linee
        const ctx = document.getElementById("graficoEntrateUscite").getContext("2d");
        chartEntrateUscite = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels, // Date come etichette
                datasets: [
                    {
                        label: "Entrate (€)",
                        data: entrate,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                        fill: true,
                        tension: 0.4 // Linea curva
                    },
                    {
                        label: "Uscite (€)",
                        data: uscite,
                        borderColor: "#FF5733",
                        backgroundColor: "rgba(255, 87, 51, 0.2)",
                        fill: true,
                        tension: 0.4 // Linea curva
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permette di personalizzare le dimensioni
                plugins: {
                    legend: {
                        display: true,
                        position: "top"
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Data"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Importo (€)"
                        }
                    }
                }
            }
        });
    }

    


});