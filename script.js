// Alamat kontrak (ganti dengan alamat yang dideploy)
const contractAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // Ganti dengan alamat kontrak Anda



// ABI kontrak (dari file `SertifikatLiterasiKeuangan.json` di folder `artifacts`)
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "participant",
				"type": "address"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_participant",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "revokeCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "certificateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "participant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "issuedDate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isValid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "verifyCertificate",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "participant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "issuedDate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isValid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Inisialisasi provider dan kontrak
let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("Wallet terhubung!");
    } catch (error) {
      console.error("Gagal terhubung ke wallet:", error);
    }
  } else {
    alert("Silakan install MetaMask untuk menggunakan fitur ini.");
  }
}

// Panggil fungsi ini saat halaman dimuat
window.onload = connectWallet;

// Fungsi untuk menerbitkan sertifikat
async function issueCertificate() {
  const participantAddress = document.getElementById("participantAddress").value;
  const participantName = document.getElementById("participantName").value;

  if (!participantAddress || !participantName) {
    alert("Mohon isi alamat dan nama peserta!");
    return;
  }

  try {
    const tx = await contract.issueCertificate(participantAddress, participantName);
    await tx.wait();
    alert("Sertifikat berhasil diterbitkan!");
  } catch (error) {
    console.error("Gagal menerbitkan sertifikat:", error);
    alert("Gagal menerbitkan sertifikat. Lihat console untuk detail.");
  }
}

// Fungsi untuk memverifikasi sertifikat
async function verifyCertificate() {
  const certificateId = document.getElementById("certificateId").value;

  if (!certificateId) {
    alert("Mohon masukkan ID sertifikat!");
    return;
  }

  try {
    const result = await contract.verifyCertificate(certificateId);
    const resultDiv = document.getElementById("verificationResult");

    if (result.isValid) {
      resultDiv.innerHTML = `
        <p><strong>ID Sertifikat:</strong> ${certificateId}</p>
        <p><strong>Nama:</strong> ${result.name}</p>
        <p><strong>Alamat Peserta:</strong> ${result.participant}</p>
        <p><strong>Tanggal Diterbitkan:</strong> ${new Date(result.issuedDate * 1000).toLocaleString()}</p>
        <p><strong>Status:</strong> Valid</p>
      `;
    } else {
      resultDiv.innerHTML = "<p>Sertifikat tidak valid atau dicabut.</p>";
    }
  } catch (error) {
    console.error("Gagal memverifikasi sertifikat:", error);
    alert("Gagal memverifikasi sertifikat. Lihat console untuk detail.");
  }
}