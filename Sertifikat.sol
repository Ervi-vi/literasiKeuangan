// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SertifikatLiterasiKeuangan {

    address public owner;
    uint public certificateCount = 0;

    constructor() {
        owner = msg.sender;
    }

    // Struktur data sertifikat
    struct Certificate {
        uint id;
        string name;
        address participant;
        uint issuedDate;
        bool isValid;
    }

    // Penyimpanan sertifikat
    mapping(uint => Certificate) public certificates;

    // Modifier hanya admin
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya admin yang bisa melakukan ini");
        _;
    }

    // Event (opsional untuk log)
    event CertificateIssued(uint id, string name, address participant);

    // Fungsi untuk menerbitkan sertifikat
    function issueCertificate(address _participant, string memory _name) public onlyOwner {
        certificateCount++;

        certificates[certificateCount] = Certificate(
            certificateCount,
            _name,
            _participant,
            block.timestamp,
            true
        );

        emit CertificateIssued(certificateCount, _name, _participant);
    }

    // Fungsi untuk verifikasi sertifikat
    function verifyCertificate(uint _id) public view returns (
        string memory name,
        address participant,
        uint issuedDate,
        bool isValid
    ) {
        Certificate memory cert = certificates[_id];
        return (cert.name, cert.participant, cert.issuedDate, cert.isValid);
    }

    // Fungsi untuk mencabut sertifikat (opsional)
    function revokeCertificate(uint _id) public onlyOwner {
        certificates[_id].isValid = false;
    }
}