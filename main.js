
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");
  const statusDisplay = document.getElementById("status");

  statusDisplay.innerHTML = "KYC Pending!";
  let statusInterval;

  function checkKYCStatus(sessionId) {
    fetch(`http://localhost:3000/check-status?session_id=${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        const status = data.status;

        if (status === "started") {
          // KYC completed, hide loader and show completion message
          loader.style.display = "block";
          statusDisplay.innerHTML = "KYC in progess please wait!";
        }

        if (status === "completed") {
          // KYC completed, hide loader and show completion message
          loader.style.display = "none";
          statusDisplay.innerHTML = "KYC completed!";
          clearInterval(statusInterval);
        }
      })
      .catch((error) => console.error("Error checking KYC status:", error));
  }

  // Configuration
  const qrConfig = {
    text: "http://localhost:4200?session_id=123", // Replace with your desired redirect URL
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H, // Error correction level (L, M, Q, H)
  };

  // Generate QR Code
  const qrCode = new QRCode(document.getElementById("qrcode"), qrConfig);

  console.log(qrCode);

  async function generateAuthToken(payload, exp) {
    let secretKey = "d16814effd0f8d37ae60c1eddd6a8794";
    const secret = new TextEncoder().encode(secretKey);

    const jwt = await SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(exp)
      .sign(secret);

    return jwt;
  }

  const payload = {
    name: "Atikur",
    session_id: "12345"
  }
  console.log(generateAuthToken(payload, 86400));

  // Periodically check KYC status
  statusInterval = setInterval(() => {
    checkKYCStatus(123);
  }, 2000); // Check every 2 seconds
});
