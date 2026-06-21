// Code base

// --- ARCHITECTURE INTERACTIVE & LOGIQUE DES PAGES ---
const pageOrderList = [
    'register',
    'service',
    'adoration',
    'virus',
    'informant',
    'results',
    'settings'
];
let currentActiveIndex = 0;

// Base de simulation d'agents inscrits
let configuredChrono = 60;
let suspectsSelected = [];
let sensorHoldTimer;

// Rendu de la liste d'agents de l'écran 1
function renderInscribedAgents() {
    const listContainer = document.getElementById('agents-list-container');
    listContainer.innerHTML = '';

    GDt.agents.forEach((agent, index) => {
        const angleClass = index % 2 === 1 ? 'spy-tilt-left' : 'spy-tilt-right';

        listContainer.innerHTML += `
                    <div class="agent-item ${angleClass}">
                        <span class="agent-name">${agent}</span>
                        <button onclick="deleteAgent(${index})" class="agent-delete-btn" aria-label="Supprimer l'agent">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                `;
    });

    // Affichage de l'aide à l'enregistrement
    const helper = document.getElementById('register-helper-text');
    if (GDt.agents.length < 5) {
        helper.textContent = "Enregistrez au moins 5 joueurs pour continuer.";
        helper.className = "register-footer-text text-red";
    } else {
        helper.textContent = "Effectif réglementaire ! Prêt à jouer.";
        helper.className = "register-footer-text text-green";
    }
}

// Ajouter un agent de simulation
function handleAddAgent() {
    const field = document.getElementById('input-new-agent');
    const name = field.value.trim().toUpperCase();

    if (!name) {
        triggerSystemToast("Veuillez saisir un nom.");
        return;
    }
    if (GDt.agents.includes(name)) {
        triggerSystemToast("Cet agent est déjà enregistré.");
        return;
    }
    if (GDt.agents.length >= 9) {
        triggerSystemToast("9 agents maximum.");
        return;
    }

    GDt.agents.push(name);
    field.value = '';
    renderInscribedAgents();
    triggerSystemToast(`Recruté : ${name}`);
}

// Supprimer un agent
function deleteAgent(index) {
    const removed = GDt.agents[index];
    GDt.agents.splice(index, 1);
    renderInscribedAgents();
    triggerSystemToast(`Retiré : ${removed}`);
}

// Navigation séquentielle déclenchée par clic sur l'empreinte digitale
function handleSequentialClick() {
    currentActiveIndex = (currentActiveIndex + 1) % pageOrderList.length;
    switchActivePage(pageOrderList[currentActiveIndex]);
}

// Gestion de l'affichage global des pages d'exemple
function switchActivePage(screenId) {
    // Cacher tous les écrans
    document.querySelectorAll('.screen-layout').forEach(el => {
        el.classList.remove('active');
    });

    // Afficher l'écran ciblé
    const screenElement = document.getElementById(`screen-${screenId}`);
    if (screenElement) {
        screenElement.classList.add('active');
    }

    // Mettre à jour l'index
    currentActiveIndex = pageOrderList.indexOf(screenId);

    // Re-flouter les rôles au changement d'écran pour la simulation
    document.querySelectorAll('.block-reveal-role').forEach(el => {
        el.classList.add('hidden-role');
        el.classList.remove('revealed-role');
    });

    // Synchronisation de l'en-tête de page
    const headerTitle = document.getElementById('screen-header-title');
    const badge = document.getElementById('screen-badge');

    switch (screenId) {
        case 'register':
            headerTitle.textContent = "INSCRIPTION";
            badge.textContent = "CONFIG";
            badge.className = "badge";
            badge.style.backgroundColor = "var(--spy-yellow)";
            badge.style.color = "var(--spy-black)";
            break;
        case 'service':
            headerTitle.textContent = "BRIEFING J1";
            badge.textContent = "SERVICE";
            badge.className = "badge";
            badge.style.backgroundColor = "var(--spy-orange)";
            badge.style.color = "var(--spy-white)";
            break;
        case 'adoration':
            headerTitle.textContent = "BRIEFING J2";
            badge.textContent = "ADORATION";
            badge.className = "badge";
            badge.style.backgroundColor = "var(--spy-red)";
            badge.style.color = "var(--spy-white)";
            break;
        case 'virus':
            headerTitle.textContent = "BRIEFING SOPHIE";
            badge.textContent = "VIRUS";
            badge.className = "badge";
            badge.style.backgroundColor = "var(--spy-red-dark)";
            badge.style.color = "var(--spy-white)";
            break;
        case 'informant':
            headerTitle.textContent = "RECHERCHER";
            badge.textContent = "INSPECTER";
            badge.className = "badge";
            badge.style.backgroundColor = "var(--spy-black)";
            badge.style.color = "var(--spy-white)";
            break;
        case 'results':
            headerTitle.textContent = "VERDICT";
            badge.textContent = "CLASSEMENT";
            badge.className = "badge";
            badge.style.backgroundColor = "#15803d"; // Green 700
            badge.style.color = "var(--spy-white)";
            break;
        case 'settings':
            headerTitle.textContent = "PARAMÈTRES";
            badge.textContent = "SYSTÈME";
            badge.className = "badge";
            badge.style.backgroundColor = "var(--spy-stone-700)";
            badge.style.color = "var(--spy-white)";
            break;
    }
}

// --- DECRYPTAGE PAR DETECTEUR D'EMPREINTE (CLIC LONG / HOLD) ---
function handleSensorHoldStart(e) {
    e.preventDefault();
    // Lancer le chronomètre de maintien (600ms requis)
    sensorHoldTimer = setTimeout(() => {
        document.querySelectorAll('.block-reveal-role').forEach(el => {
            el.classList.remove('hidden-role');
            el.classList.add('revealed-role');
        });
        document.querySelectorAll('.anti-reveal-role').forEach(el => {
            el.classList.add('hidden-role');
            el.classList.remove('revealed-role');
        });
        triggerSystemToast("🔑 ENVELOPPE DÉCRYPTÉE !");
    }, 600);
}

function handleSensorHoldEnd() {
    clearTimeout(sensorHoldTimer);
    document.querySelectorAll('.block-reveal-role').forEach(el => {
        el.classList.add('hidden-role');
        el.classList.remove('revealed-role');
    });
    document.querySelectorAll('.anti-reveal-role').forEach(el => {
        el.classList.remove('hidden-role');
        el.classList.add('revealed-role');
    });
}

// --- PHASE ENQUÊTE : CHOIX DES SUSPECTS ---
function toggleSuspect(btnElement, suspectName) {
    const checkIndicator = btnElement.querySelector('.check-box-indicator');

    if (suspectsSelected.includes(suspectName)) {
        // Désélection
        suspectsSelected = suspectsSelected.filter(name => name !== suspectName);

        // Retirer le style actif en rétablissant les classes d'origine
        if (suspectName === "O'KS" || suspectName === "DBDJ") {
            btnElement.className = "suspect-btn dark-theme";
        } else {
            btnElement.className = "suspect-btn light-theme";
        }
        checkIndicator.textContent = '';
    } else {
        // Sélection
        if (suspectsSelected.length >= 2) {
            triggerSystemToast("Deux suspects maximum.");
            return;
        }
        suspectsSelected.push(suspectName);

        // Appliquer style sélectionné uniforme jaune
        btnElement.className = "suspect-btn";
        btnElement.style.backgroundColor = "var(--spy-yellow)";
        btnElement.style.color = "var(--spy-black)";

        checkIndicator.textContent = '✓';
    }
}

function verifySuspectFactions() {
    if (suspectsSelected.length < 2) {
        triggerSystemToast("Désignez d'abord 2 coupables.");
        return;
    }
    triggerSystemToast(`Analyse : ${suspectsSelected.join(' & ')}`);
    setTimeout(() => {
        const virusCheck = suspectsSelected.some(name => name === "O'KS" || name === "DBDJ");
        if (virusCheck) {
            triggerSystemToast("☢️ ALERTE : L'un d'eux est un agent du VIRUS !");
        } else {
            triggerSystemToast("👁️ RAS : Les deux agents sont sains.");
        }
    }, 1000);
}

// --- OPTIONS / PARAMÈTRES INTERACTIFS ---
function setScenarioDifficulty(btn) {
    document.querySelectorAll('.difficulty-option').forEach(el => {
        el.classList.remove('active');
    });
    btn.classList.add('active');
    triggerSystemToast(`Difficulté : ${btn.textContent}`);
}

function changeChronoValue(amount) {
    configuredChrono = Math.max(10, configuredChrono + amount);
    document.getElementById('select-value').textContent = `${configuredChrono}s`;
}

// Notification visuelle intégrée
function triggerSystemToast(message) {
    const toast = document.getElementById('toast-notif');
    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 2200);
}

// Ouvrir / Fermer la fenêtre d'aide
function toggleInfoModal() {
    const modal = document.getElementById('help-modal');
    modal.classList.toggle('active');
}

function handleOutsideModalClick(e) {
    if (e.target.id === 'help-modal') {
        toggleInfoModal();
    }
}

// Réinitialiser la partie
function restartGameSession() {
    suspectsSelected = [];
    document.querySelectorAll('.suspect-btn').forEach(btn => {
        btn.style.backgroundColor = "";
        btn.style.color = "";

        const nameSpan = btn.querySelector('.suspect-label');
        const isNpc = nameSpan.textContent === "O'KS" || nameSpan.textContent === "DBDJ";
        if (isNpc) {
            btn.className = "suspect-btn dark-theme";
        } else {
            btn.className = "suspect-btn light-theme";
        }
        btn.querySelector('.check-box-indicator').textContent = '';
    });
    switchActivePage('register');
    triggerSystemToast("🔄 Table de jeu nettoyée.");
}

// Lancement initial de l'application
window.onload = function () {
    renderInscribedAgents();
}
// Code plus

var GDt = {
    page: 'register',
    agents: ["J1", "J2", "SOPHIE", "HUGO", "O'KS"],
    roles: [],
    startingroles: [],
    cibles: [],
    ajouer: [],
    selects: {
        'virus': { max: 0, min: 0, value: 0 }
    },
    actions: [],
    act: {
        vis: ['cfs', 'aph', 'rsd', 'ifa'], //, 'its', 'IFS'
        sec: ['rcn', 'ado', 'bem', 'agd', 'NRM'],
        vistmp: [],
        sectmp: []
    },
    actualId: None
}

function randint(a, b) {
    return Math.floor(Math.random() * (b - a)) + a
}

function fillAjouer() {
    GDt.ajouer = Array.from({ length: GDt.agents.length }, (_, i) => i)
}

function popRanList(lst) {
    const idxs = randint(0, lst.length)
    const idxr = lst[idxs]
    lst.splice(idxs, 1)
    return idxr
}

function popAjouer() {
    return popRanList(GDt.ajouer)
}

function clickNext() {
    if (GDt.page == 'register') {
        GDt.page = 'role';
        document.getElementById('screen-register').classList.remove('active');
        document.getElementById('screen-role').classList.add('active');

        GDt.roles = Array(GDt.agents.length).fill('service');
        fillAjouer();
        for (let i = 0; i < GDt.selects.virus.value; i++) {
            const idxr = popAjouer();
            GDt.roles[idxr] = 'virus';
        }

        fillAjouer();
        document.getElementById('for-all-icon').classList.add('hidden');
        document.getElementById('private-icon').classList.remove('hidden');
        document.getElementById('trigger-fingerprint').classList.remove('hidden');
    }

    if (GDt.page == 'role') {

        if (GDt.ajouer.length == 0) {
            GDt.page = 'actintro';
            document.getElementById('screen-role').classList.remove('active');
            fillAjouer();
            GDt.actions = Array(GDt.agents.length);
            GDt.cibles = Array(GDt.agents.length);
            GDt.act.vistmp = [...GDt.act.vis];
            GDt.startingroles = [...GDt.roles];
        } else {
            const idx = popAjouer();
            const name = GDt.agents[idx];
            const role = GDt.roles[idx];
            document.getElementById('header-name').innerText = name;
            document.getElementById('envelope-virus').classList.add('hidden');
            document.getElementById('envelope-service').classList.add('hidden');
            document.getElementById('envelope-' + role).classList.remove('hidden');
            if (role == 'service') {
                document.getElementById('nb-virus').innerText = GDt.selects.virus.value;
            } else {
                let txt = '<span class="complice-label">Complices :</span>'
                for (i = 0; i < GDt.roles.length; i++) {
                    if (i != idx && GDt.roles[i] == 'virus') {
                        txt += '<span class="complice-value">' + GDt.agents[i] + '</span>'
                    }
                }
                document.getElementById('virus-list').innerHTML = txt;
            }
        }

    }

    if (GDt.page == 'actintro') {
        if (GDt.ajouer.length == 0) {

        } else {
            GDt.actualId = popAjouer();
            const name = GDt.agents[GDt.actualId];
            document.querySelectorAll('.header-name-act').forEach(el => el.innerText = name);
            if (GDt.act.vistmp.length == 0) {
                GDt.actions[GDt.actualId] = 'IFS';
                GDt.act.vistmp = [...GDt.act.vis];
            } else {
                GDt.actions[GDt.actualId] = popRanList(GDt.act.vistmp);
            }
            document.getElementById('screen-actintro').classList.add('active');
            document.getElementById('screen-classic').classList.remove('active');
            document.getElementById('screen-select').classList.remove('active');
            document.getElementById('for-all-icon').classList.remove('hidden');
            document.getElementById('private-icon').classList.add('hidden');
            document.getElementById('trigger-fingerprint').classList.add('hidden');
            const title = document.getElementById('actintro-title');
            const div = document.getElementById('actintro-text');
            const act = GDt.actions[GDt.actualId];
            if (act == 'cfs') {
                title.innerText = "CONFESSION";
                div.innerHTML = `<div class="envelope-line spy-tilt-right">
        <p>Le joueur actif doit montrer à un <span class="text-highlight-bold">(et un seul)</span> autre agent, l’agence pour laquelle il ou elle travaille.</p>
    </div>`;
                GDt.page = 'classic';
            } else if (act == 'its') {
                title.innerText = "INFORMATEUR SECRET";
                div.innerHTML = `<div class="envelope-line spy-tilt-left">
        <p>Le joueur actif doit sélectionner <span class="text-highlight-bold">deux agents</span>.</p>
    </div>
    <div class="envelope-line spy-tilt-right">
        <p>L’informateur révélera si l’un d’eux est un agent du <span class="text-highlight-bold">VIRUS</span>.</p>
    </div>`;
                GDt.page = 'select';
            } else if (act == 'IFS') {
                title.innerText = "INFO SECRETE";
                div.innerHTML = `
    <div class="envelope-line spy-tilt-slight">
        <p><span class="text-highlight-bold">DOSSIER SECRET</span> - Le joueur actif a reçu des informations à propos de l’agence d’un des autres agents.</p>
    </div>`;
                if (GDt.act.sectmp.length == 0) {
                    GDt.act.sectmp = [...GDt.act.sec];
                }
                GDt.actions[GDt.actualId] = popRanList(GDt.act.vistmp);
                if (GDt.actions[GDt.actualId] == 'NRM') {
                    if (GDt.act.vistmp.length == 0) {
                        GDt.act.vistmp = [...GDt.act.vis];
                    }
                    GDt.actions[GDt.actualId] = popRanList(GDt.act.vistmp);
                }
                GDt.page = 'classic';
            } else if (act == 'aph') {
                title.innerText = "ANCIENNES PHOTOGRAPHIES";
                div.innerHTML = `
    <div class="envelope-line spy-tilt-left">
        <p>Le joueur actif a trouvé des preuves montrant, qu’au début, <span class="text-highlight-bold">deux agents</span> travaillaient pour la <span class="text-highlight-bold">même agence</span>.</p>
    </div>`;
                GDt.page = 'classic';
            } else if (act == 'rsd') {
                title.innerText = "RENSEIGNEMENTS DANOIS";
                div.innerHTML = `
    <div class="envelope-line spy-tilt-right">
        <p>Le joueur actif a intercepté une transmission avec <span class="text-highlight-bold">deux noms</span> : l’un est un agent du <span class="text-highlight-bold">VIRUS</span>, l’autre non.</p>
    </div>`;
                GDt.page = 'classic';
            } else if (act == 'ifa') {
                title.innerText = "INFO ANONYME";
                div.innerHTML = `
    <div class="envelope-line spy-tilt-slight">
        <p>Le joueur actif consulte son informateur et <span class="text-highlight-bold">découvre l’agence</span> d’un des autres agents.</p>
    </div>`;
                GDt.page = 'classic';
            }

        }
    }
    else
        if (GDt.page == 'classic') {

            document.getElementById('screen-actintro').classList.remove('active');

            document.getElementById('screen-classic').classList.add('active');
            document.getElementById('for-all-icon').classList.add('hidden');
            document.getElementById('private-icon').classList.remove('hidden');
            document.getElementById('trigger-fingerprint').classList.remove('hidden');
            const title = document.getElementById('classic-title');
            const div = document.getElementById('classic-text');
            const act = GDt.actions[GDt.actualId];
            if (act == 'cfs') {
                title.innerText = "CONFESSION";
                div.innerHTML = `<div class="envelope-line spy-tilt-right">
        <p>${GDt.agents[GDt.actualId]} travaille actuellement pour <span class="text-highlight-bold">le ${GDt.roles[GDt.actualId]}</span>.</p>
    </div>`;
                GDt.page = 'actintro';
            } else if (act == 'aph') {
                title.innerText = "ANCIENNES PHOTOGRAPHIES";
                const ajsave = [...GDt.ajouer];
                fillAjouer();
                const j1 = popAjouer();
                let j2 = popAjouer();
                while (GDt.roles[j1] != GDt.roles[j2] || GDt.ajouer.length == 0) {
                    j2 = popAjouer();
                }
                GDt.ajouer = [...ajsave];
                div.innerHTML = `
    <div class="envelope-line spy-tilt-left">
        <p>Vos archives indiquent que ces deux individus ont commencé leur carrière sous la même bannière :</p>
    </div>
    <div class="envelope-line spy-tilt-slight">
        <span class="target-subtext">Premier agent :</span> <span class="target-name">${GDt.agents[j1]}</span>
    </div>
    <div class="envelope-line spy-tilt-right">
        <span class="target-subtext">Second agent :</span> <span class="target-name">${GDt.agents[j2]}</span>
    </div>
    <div class="envelope-line spy-tilt-left">
        <p class="tips-text">Note : Ils appartenaient à la <span class="text-highlight-bold">même agence</span> au début de la partie.</p>
    </div>`;
                GDt.page = 'actintro';
            } else if (act == 'rsd') {
                title.innerText = "RENSEIGNEMENTS DANOIS";
                const ajsave = [...GDt.ajouer];
                fillAjouer();
                const j1 = popAjouer();
                let j2 = popAjouer();
                while (GDt.roles[j1] == GDt.roles[j2] || GDt.ajouer.length == 0) {
                    j2 = popAjouer();
                }
                GDt.ajouer = [...ajsave];
                div.innerHTML = `
    <div class="envelope-line spy-tilt-right">
        <p>La transmission interceptée lie les deux noms suivants à des camps opposés :</p>
    </div>
    <div class="envelope-line spy-tilt-slight">
        <span class="target-subtext">Agent A :</span> <span class="target-name">${GDt.agents[j1]}</span>
    </div>
    <div class="envelope-line spy-tilt-left">
        <span class="target-subtext">Agent B :</span> <span class="target-name">${GDt.agents[j2]}</span>
    </div>
    <div class="envelope-line spy-tilt-right">
        <p class="tips-text">Règle : L'un est membre du <span class="text-highlight-bold">VIRUS</span>, l'autre appartient au <span class="text-highlight-bold">Service</span>. À vous de déduire qui est qui.</p>
    </div>`;
                GDt.page = 'actintro';
            } else if (act == 'ifa') {
                title.innerText = "INFO ANONYME";
                let idx = randint(0, GDt.agents.length);
                div.innerHTML = `
    <div class="envelope-line spy-tilt-right">
        <p>Voici les informations confidentielles interceptées à propos de votre cible :</p>
    </div>
    <div class="envelope-line spy-tilt-slight">
        <span class="target-subtext">Agent ciblé :</span> <span class="target-name">${GDt.agents[idx]}</span>
    </div>
    <div class="envelope-line spy-tilt-left">
        <span class="target-subtext">Agence découverte :</span> <span class="text-highlight-bold">le ${GDt.roles[idx]}</span>
    </div>`;
                GDt.page = 'actintro';
            }

        }
}




function changeQuantityValue(id, amount) {
    GDt.selects.virus.max = GDt.agents.length;
    const select = GDt.selects[id];
    select.value = Math.max(Math.min(select.max, select.value + amount), select.min);
    document.getElementById(`select-${id}-value`).textContent = `${select.value}`;
    return select.value;
}



