const d = document.getElementById("d");
const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");

// Fonction pour obtenir un numéro avec un zéro devant si inférieur à 10
function getTrueNumber(num) {
  return num < 10 ? "0" + num : num;
}

// Initialiser la durée du compte à rebours à 10 jours
const countdownStartTime = new Date().getTime(); // Heure actuelle
const countdownDuration = 10 * 24 * 60 * 60 * 1000; // 10 jours en millisecondes
let countdownEndTime = localStorage.getItem("countdownEndTime");

if (!countdownEndTime) {
  // Si l'heure de fin n'est pas dans le localStorage, on la calcule et on la stocke
  const countdownStartTime = new Date().getTime(); // Heure actuelle
  countdownEndTime = countdownStartTime + countdownDuration; // Heure de fin du compte à rebours
  localStorage.setItem("countdownEndTime", countdownEndTime);
} else {
  countdownEndTime = parseInt(countdownEndTime); // Convertir en entier
}

function calculateRemainingTime() {
  const now = new Date();
  const remainingTime = countdownEndTime - now.getTime(); // Temps restant en millisecondes

  // Si le compte à rebours est terminé
  if (remainingTime <= 0) {
    clearInterval(countdownInterval);
    isLotteryPickable = true; // Le tirage peut commencer
    isTicketPurchasable = false; // L'achat des tickets est maintenant désactivé
    updateContractInfo(); // Mettre à jour les informations du contrat
    document.getElementById("countdown").innerText = "Tirage à venir..."; // Afficher que le tirage est prêt
    return;
  }

  // Calculer jours, heures, minutes et secondes
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

  // Affichage du compte à rebours
  d.innerHTML = getTrueNumber(days); // Affichage des jours
  h.innerHTML = getTrueNumber(hours); // Affichage des heures
  m.innerHTML = getTrueNumber(mins); // Affichage des minutes
  s.innerHTML = getTrueNumber(secs); // Affichage des secondes
}

let isLotteryPickable = false; // Initialement, on ne peut pas tirer le gagnant
let isTicketPurchasable = true; // Les tickets sont disponibles
let countdownInterval;

function initCountdown() {
  let countdownEndTime = localStorage.getItem("countdownEndTime");
  if (!countdownEndTime) {
    countdownEndTime = new Date().getTime() + 10 * 24 * 60 * 60 * 1000; // 10 jours par défaut
  } else {
    countdownEndTime = parseInt(countdownEndTime); // Convertir en entier
  }

  countdownInterval = setInterval(() => {
    const remainingTimeInMs = calculateRemainingTime();

    if (remainingTimeInMs <= 1000) {
      // Si le compte à rebours atteint zéro
      clearInterval(countdownInterval); // Arrêter l'intervalle
      isLotteryPickable = true; // Le tirage peut commencer
      isTicketPurchasable = false; // L'achat des tickets est maintenant désactivé
      updateContractInfo(); // Mettre à jour les informations du contrat
    }
  }, 1000); // Rafraîchissement toutes les secondes
}

function forceCountdownToZero() {
  // Force le compte à rebours à zéro immédiatement
  clearInterval(countdownInterval);
  d.innerHTML = "00"; // Mettre à jour le compte à rebours affiché
  h.innerHTML = "00";
  m.innerHTML = "00";
  s.innerHTML = "00";
  isLotteryPickable = true; // Le tirage peut commencer immédiatement
  isTicketPurchasable = false; // L'achat des tickets est désactivé
  updateContractInfo(); // Mettre à jour les informations du contrat
}

// Lancer le compte à rebours au début
initCountdown();

let provider;
let signer;
let contract;
let isAdmin = false;
// let isLotteryPickable = false;
const contractAddress = "0x6b5A0be54728B65a7B1EEC94044F9f8f34332138";
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "gagnant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "montant",
        type: "uint256",
      },
    ],
    name: "GagnantTire",
    type: "event",
  },
  {
    inputs: [],
    name: "Acheter",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "Cloturer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "Demarrer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "Tirer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CurrentContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dernierGain",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isTicketPurchasable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ListeJoueurs",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "participants",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

window.onload = initializeReadOnlyContract;

function toggleAdminButtons() {
  document.getElementById("demarrerLoterie").style.display = isAdmin
    ? "block"
    : "none";
  document.getElementById("cloturerLoterie").style.display = isAdmin
    ? "block"
    : "none";
  document.getElementById("tirerGagnant").style.display = isAdmin
    ? "block"
    : "none";
}

// var isTicketPurchasable = true;
// const countdownStartDate = new Date("2024-11-15T00:00:00Z");
// const countdownDuration = 10 * 24 * 60 * 60 * 1000;
// const countdownEndTime = countdownStartDate.getTime() + countdownDuration;

function updateCountdown() {
  const now = Date.now();
  const timeLeft = countdownEndTime - now;

  if (timeLeft <= 0) {
    document.getElementById("countdown").innerText = "Tirage à venir...";
    clearInterval(countdownInterval);
    isTicketPurchasable = false;
    isLotteryPickable = true;
    return;
  }

  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

  //   document.getElementById(
  //     "countdown"
  //   ).innerText = Tirage dans : ${days}j ${hours}h ${minutes}m ${seconds}s;
}

// const countdownInterval = setInterval(updateCountdown, 1000);

function toggleAdminButtons() {
  if (isAdmin) {
    document.getElementById("demarrerLoterie").style.display = "block";
    document.getElementById("cloturerLoterie").style.display = "block";
    document.getElementById("tirerGagnant").style.display = "block";
  } else {
    document.getElementById("demarrerLoterie").style.display = "none";
    document.getElementById("cloturerLoterie").style.display = "none";
    document.getElementById("tirerGagnant").style.display = "none";
  }
}

// Fonction principale appelée à l'ouverture de la page
window.onload = async () => {
  const storedAddress = localStorage.getItem("signerAddress");

  if (storedAddress) {
    // L'utilisateur est connecté
    document.getElementById("disconnectButton").style.display = "block"; // Afficher le bouton de déconnexion
    document.getElementById("connectButton").style.display = "none"; // Masquer le bouton de connexion

    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const userAddress = storedAddress;

      // Afficher l'adresse stockée
      document.getElementById("userAddress").innerText = `${userAddress}`;

      // Initialiser le contrat
      contract = new ethers.Contract(contractAddress, abi, signer);

      // Vérifier si l'utilisateur est admin
      if (userAddress === "0x976EA74026E726554dB657fA54763abd0C3a0aa9") {
        console.log(`Connecté en tant que: ${userAddress}, [ADMIN]`);
        isAdmin = true;
      } else {
        console.log(`Connecté en tant que: ${userAddress}, [USER]`);
        isAdmin = false;
      }

      // Afficher ou masquer la carte Admin et Utilisateur
      toggleAdminCard();
      toggleUserCard(true);

      // Afficher ou masquer les boutons Admin
      toggleAdminButtons();

      // Récupérer et afficher les informations du contrat
      await updateContractInfo();

      // Afficher le solde de l'utilisateur
      const balance = await provider.getBalance(userAddress);
      const balanceInEth = parseFloat(
        ethers.utils.formatEther(balance)
      ).toFixed(4);
      document.getElementById("userBalance").innerText = `${balanceInEth} ETH`;
    } else {
      alert("MetaMask n'est pas détecté. Veuillez l'installer.");
    }
  } else {
    // Si aucun utilisateur n'est connecté
    document.getElementById("disconnectButton").style.display = "none";
    document.getElementById("connectButton").style.display = "block";

    // Initialiser les informations en mode lecture seule
    await initializeReadOnlyContract();

    // Masquer la carte Admin et Utilisateur
    toggleAdminCard();
    toggleUserCard(false);
  }
};

// Fonction pour afficher ou masquer la carte admin en fonction du rôle
function toggleAdminCard() {
  const adminCard = document.querySelector(".card.admin"); // Assurez-vous d'ajouter la classe admin à votre carte admin dans le HTML

  if (adminCard) {
    if (isAdmin) {
      adminCard.style.display = "block"; // Afficher la carte admin
    } else {
      adminCard.style.display = "none"; // Masquer la carte admin
    }
  }
}

// Fonction pour afficher ou masquer la carte utilisateur
function toggleUserCard(isConnected) {
  const userCard = document.querySelector(".card.utilisateur"); // Assurez-vous d'ajouter la classe utilisateur à votre carte utilisateur dans le HTML

  if (userCard) {
    if (isConnected) {
      userCard.style.display = "flex"; // Afficher la carte utilisateur
    } else {
      userCard.style.display = "none"; // Masquer la carte utilisateur
    }
  }
}

// Fonction pour initialiser les informations en mode "lecture seule" du contrat
async function initializeReadOnlyContract() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Mettre à jour les informations du contrat
    const participants = await contract.ListeJoueurs();
    const totalTickets = participants.length;
    document.getElementById("totalTickets").innerText = `${totalTickets}`;

    const contractBalance = await contract.CurrentContractBalance();
    document.getElementById(
      "contractBalance"
    ).innerText = `${ethers.utils.formatEther(contractBalance)} ETH`;
  } else {
    alert("MetaMask n'est pas détecté. Veuillez l'installer.");
  }
}

// Fonction pour gérer la déconnexion
document.getElementById("disconnectButton").onclick = async () => {
  if (window.ethereum) {
    localStorage.removeItem("signerAddress");

    try {
      // Demander les permissions pour changer de compte
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      // Effacer les informations de l'utilisateur
      document.getElementById("userAddress").innerText = "";
      document.getElementById("userBalance").innerText = "";
      document.getElementById("totalTickets").innerText = "";
      document.getElementById("userTickets").innerText = "";
      document.getElementById("contractBalance").innerText = "";
      document.getElementById("gagnant").innerText = "";

      isAdmin = false;
      toggleAdminButtons();
      toggleAdminCard();
      toggleUserCard(false);

      // Réinitialiser les informations du contrat
      await initializeReadOnlyContract();

      // Mettre à jour l'affichage des boutons
      document.getElementById("disconnectButton").style.display = "none";
      document.getElementById("connectButton").style.display = "block";

      alert("Compte changé. Veuillez vous reconnecter.");
    } catch (error) {
      console.error("Erreur lors du changement de compte", error);
      alert("Erreur lors du changement de compte : " + error.message);
    }
  } else {
    alert("MetaMask n'est pas installé");
  }
};

document.getElementById("connectButton").onclick = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    const userAddress = await signer.getAddress();
    localStorage.setItem("signerAddress", userAddress);
    document.getElementById("userAddress").innerText = `${userAddress}`;

    if (userAddress == "0x976EA74026E726554dB657fA54763abd0C3a0aa9") {
      console.log(`Connecté en tant que: ${userAddress}, [ADMIN]`);
      isAdmin = true;
    } else {
      console.log(`Connecté en tant que: ${userAddress}, [USER]`);
      isAdmin = false;
    }

    toggleAdminButtons();
    updateContractInfo();
    location.reload();

    const balance = await provider.getBalance(userAddress);
    const balanceInEth = parseFloat(ethers.utils.formatEther(balance)).toFixed(
      4
    );
    document.getElementById("userBalance").innerText = `${balanceInEth} ETH`;

    // Masquer le bouton de connexion après la connexion
    document.getElementById("connectButton").style.display = "none";
  } else {
    alert("MetaMask n'est pas installé");
  }
};

document.getElementById("acheterTicket").onclick = async () => {
  if (isTicketPurchasable === false) {
    alert("L'achat de tickets est actuellement désactivé.");
  } else {
    try {
      const userAddress = await signer.getAddress();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const tx = await contract.Acheter({
        value: ethers.utils.parseEther("0.01"),
      });

      await tx.wait();
      console.log("1 Ticket acheté avec succès");

      const balance = await provider.getBalance(userAddress);
      const balanceInEth = parseFloat(
        ethers.utils.formatEther(balance)
      ).toFixed(4);
      document.getElementById(
        "userBalance"
      ).innerText = `Solde de l'utilisateur : ${balanceInEth} ETH`;

      updateContractInfo();
    } catch (error) {
      console.error("Erreur lors de l'achat du ticket", error);
      alert("Erreur lors de l'achat du ticket", error);
    }
  }
};

// Fonction pour démarrer la loterie
document.getElementById("demarrerLoterie").onclick = async () => {
  try {
    // Réinitialiser le compte à rebours à 10 jours
    const countdownStartTime = new Date().getTime();
    const countdownDuration = 10 * 24 * 60 * 60 * 1000; // 10 jours en millisecondes
    const countdownEndTime = countdownStartTime + countdownDuration;
    localStorage.setItem("countdownEndTime", countdownEndTime);

    // Démarrer la loterie
    const tx = await contract.Demarrer();
    await tx.wait();
    console.log("Loterie démarrée !");
    isTicketPurchasable = true;
    updateContractInfo();

    // Redémarrer le compte à rebours
    initCountdown();
  } catch (error) {
    console.error(error);
    alert("Erreur lors du démarrage de la loterie");
  }
};

// Fonction pour clôturer la loterie
document.getElementById("cloturerLoterie").onclick = async () => {
  try {
    const tx = await contract.Cloturer();
    await tx.wait();
    console.log("Loterie clôturée !");
    isTicketPurchasable = false;

    // Forcer le compte à rebours à atteindre zéro
    forceCountdownToZero();
  } catch (error) {
    console.error(error);
    console.log("Erreur lors de la fermeture de la loterie");
  }
};

// Fonction pour tirer le gagnant de la loterie
document.getElementById("tirerGagnant").onclick = async () => {
  if (isLotteryPickable === false) {
    alert(
      "Le tirage ne peut pas avoir lieu tant que le temps n'est pas écoulé."
    );
    return;
  } else {
    try {
      const tx = await contract.Tirer();
      await tx.wait();

      contract.on("GagnantTire", (gagnant, montant) => {
        const prize = ethers.utils.formatEther(montant);
        document.getElementById(
          "gagnant"
        ).innerText = `Le gagnant a été tiré ! (${gagnant}) Il remporte ${prize} ETH !`;
      });

      console.log("Le gagnant de la loterie a été tiré !");
      updateContractInfo();
    } catch (error) {
      console.error(error);
      alert("Erreur lors du tirage");
    }
  }
};

async function updateContractInfo() {
  if (!contract) return;

  // Récupération des participants
  const participants = await contract.ListeJoueurs();
  const totalTickets = participants.length;
  document.getElementById("totalTickets").innerText = `${totalTickets}`;

  // Si un signer est présent, affichez le nombre de tickets de l'utilisateur
  if (signer) {
    const userAddress = await signer.getAddress();
    let userTickets = 0;

    participants.forEach((participant) => {
      if (participant.toLowerCase() === userAddress.toLowerCase()) {
        userTickets++;
      }
    });

    document.getElementById("userTickets").innerText = `${userTickets}`;
  }

  // Récupération du solde du contrat
  const contractBalance = await contract.CurrentContractBalance();
  document.getElementById(
    "contractBalance"
  ).innerText = `${ethers.utils.formatEther(contractBalance)} ETH`;

  // Récupération du dernier gain
  const dernierGain = await contract.dernierGain();
  if (dernierGain.eq(ethers.constants.Zero)) {
    document.getElementById("dernierGain").innerText = `Dernier gagnant: Aucun`;
  } else {
    document.getElementById(
      "dernierGain"
    ).innerText = `Le dernier gain est : ${ethers.utils.formatEther(
      dernierGain
    )} ETH !`;
  }
}

async function stopcounter() {
  clearInterval(countdownInterval);
  forceCountdownToZero();
  console.log("Loterie clôturée !");
}
