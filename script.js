const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9DIbNo3EeAa498AwI58Su7uA9BIxWofWCPea14eaT_J-XEy8Jh5OChlJ0MwqOOd-e4g/exec"; // ใส่ URL ของคุณเอง

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.style.display = 'none');
  document.getElementById(sectionId).style.display = 'block';
}

// เพิ่มแต้ม
function addPoints() {
  const phone = document.getElementById("addPointPhone").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const resultDiv = document.getElementById("addPointResult");

  if (!/^0\d{9}$/.test(phone) || isNaN(amount)) {
    resultDiv.innerHTML = `<p class="text-red-500">❌ กรุณากรอกเบอร์ และจำนวนเงินให้ถูกต้อง</p>`;
    return;
  }

  const pointsAdded = Math.floor(Number(amount) / 100);

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({ phone, amount, action: "addPoints" })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      resultDiv.innerHTML = `
        <p class="text-green-500">✅ เพิ่ม ${pointsAdded} แต้มสำเร็จ!</p>
        <p class="text-blue-500">🎯 แต้มรวมตอนนี้: ${data.points} แต้ม</p>
      `;
    } else {
      resultDiv.innerHTML = `<p class="text-red-500">⚠️ ${data.message}</p>`;
    }
  })
  .catch(() => alert("❌ เกิดข้อผิดพลาดในการเพิ่มแต้ม"));
}

// แลกของรางวัล
function redeemPoints() {
  const phone = document.getElementById("redeemPhone").value.trim();
  const reward = document.getElementById("rewardSelect").value;
  const resultDiv = document.getElementById("redeemResult");

  if (!/^0\d{9}$/.test(phone) || !reward) {
    resultDiv.innerHTML = `<p class="text-red-500">❌ กรุณากรอกเบอร์ และเลือกของรางวัล</p>`;
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({ phone, reward, action: "redeem" })
  })
  .then(res => res.json())
  .then(data => {
    resultDiv.innerHTML = data.status === "success"
      ? `<p class="text-green-500">🎁 แลกของรางวัลสำเร็จ!</p>`
      : `<p class="text-red-500">⚠️ ${data.message}</p>`;
  })
  .catch(() => alert("❌ เกิดข้อผิดพลาดในการแลกของรางวัล"));
}

// สแกน QR สำหรับเพิ่มแต้ม
function startScannerForAddPoint() {
  const readerDiv = document.getElementById("reader-add");
  readerDiv.classList.remove('hidden');

  const html5QrCode = new Html5Qrcode("reader-add");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    decodedText => {
      html5QrCode.stop();
      readerDiv.classList.add('hidden');
      document.getElementById("addPointPhone").value = decodedText.trim();
      alert("✅ สแกนสำเร็จ! กรุณากรอกจำนวนเงินแล้วกด ➕ เพิ่มแต้ม");
    },
    error => {}
  ).catch(err => {
    alert("❌ ไม่สามารถเปิดกล้องได้: " + err);
  });
}

// สแกน QR สำหรับแลกของรางวัล
function startScannerForRedeem() {
  const readerDiv = document.getElementById("reader");
  readerDiv.classList.remove('hidden');

  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    decodedText => {
      html5QrCode.stop();
      readerDiv.classList.add('hidden');
      document.getElementById("redeemPhone").value = decodedText.trim();
      alert("✅ สแกนสำเร็จ! กรุณาเลือกของรางวัลแล้วกดแลกของรางวัล");
    },
    error => {}
  ).catch(err => {
    alert("❌ ไม่สามารถเปิดกล้องได้: " + err);
  });
}
