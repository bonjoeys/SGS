// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Gestion de la Navigation ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Gérer la classe 'active' pour les liens
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Afficher la page correspondante
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // --- Chargement des Données et Initialisation des Visualisations ---
    // Ce chemin est correct, mais assure-toi que le fichier existe bien !
    fetch('data/donnees.json')
       .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Le fichier data/donnees.json est-il bien sur GitHub ?`);
            }
            return response.json();
       })
       .then(data => {
            // Initialisation des KPIs
            initKPIs(data.kpis);
            
            // Initialisation des graphiques
            initPartsMarcheChart(data.partsMarcheCT);
            initEvolutionCaChart(data.evolutionCA);
            initNbCentresChart(data.nombreCentresActeur);
            initPositionnementChart(data.positionnementStrategique);
            initStructureCoutsChart(data.structureCouts);
            initSourcesRevenusChart(data.sourcesRevenus);

            // Initialisation de la carte
            initMap(data.maillageReseaux);
        })
       .catch(error => console.error("Erreur critique lors du chargement des données:", error));

    // --- Fonctions d'Initialisation ---

    function initKPIs(kpis) {
        document.getElementById('kpi-nb-centres').textContent = kpis.nbCentresCT;
        document.getElementById('kpi-pdm-sgs').textContent = kpis.partMarcheSGS;
        document.getElementById('kpi-vol-ct').textContent = kpis.volumeControles;
        document.getElementById('kpi-vol-code').textContent = kpis.volumeExamensCode;
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };

    function initPartsMarcheChart(chartData) {
        const ctx = document.getElementById('partsMarcheChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                // CORRIGÉ : La syntaxe pour les datasets a été réparée
                datasets: chartData.datasets 
            },
            options: chartOptions
        });
    }

    function initEvolutionCaChart(chartData) {
        const ctx = document.getElementById('evolutionCaChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                // CORRIGÉ : La syntaxe pour les datasets a été réparée
                datasets: chartData.datasets
            },
            options: chartOptions
        });
    }

    function initNbCentresChart(chartData) {
        const ctx = document.getElementById('nbCentresChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                // CORRIGÉ : La syntaxe pour les datasets a été réparée
                datasets: chartData.datasets
            },
            options: {
               ...chartOptions,
                indexAxis: 'y',
                plugins: { legend: { display: false } }
            }
        });
    }

    function initPositionnementChart(chartData) {
        const ctx = document.getElementById('positionnementChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartData.labels,
                datasets: chartData.datasets
            },
            options: {
               ...chartOptions,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 5,
                        pointLabels: { font: { size: 10 } }
                    }
                }
            }
        });
    }

    function initStructureCoutsChart(chartData) {
        const ctx = document.getElementById('structureCoutsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                // CORRIGÉ : La syntaxe pour les datasets a été réparée
                datasets: chartData.datasets
            },
            options: chartOptions
        });
    }

    function initSourcesRevenusChart(chartData) {
        const ctx = document.getElementById('sourcesRevenusChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                // CORRIGÉ : La syntaxe pour les datasets a été réparée
                datasets: chartData.datasets
            },
            options: {
               ...chartOptions,
                plugins: { legend: { display: false } }
            }
        });
    }

    function initMap(mapData) {
        const map = L.map('map').setView([46.603354, 1.888334], 6); // Centré sur la France

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapData.forEach(reseau => {
            L.marker(reseau.coords).addTo(map)
               .bindPopup(`<b>${reseau.nom}</b><br>${reseau.nbCentres} centres`);
        });
    }
}); // CORRIGÉ : Accolade et parenthèse en trop supprimées après cette ligne