const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9DIbNo3EeAa498AwI58Su7uA9BIxWofWCPea14eaT_J-XEy8Jh5OChlJ0MwqOOd-e4g/exec"; // <== เปลี่ยนเป็น URL ของคุณเอง

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// สมัครลูกค้า
function registerUser() {
  const phone = document.getElementById("registerPhone").value.trim();
  const resultDiv = document.getElementById("registerResult");

  if (!/^0\d{9}$/.test(phone)) {
    resultDiv.innerHTML = `<p class="text-red-500">❌ กรุณากรอกเบอร์ให้ถูกต้อง</p>`;
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({ phone, action: "register" })
  })
  .then(res => res.json())
  .then(data => {
    let text = "", cssClass = "";
    if (data.status === "success") {
      text = `✅ สมัครสำเร็จในชื่อ: <strong>${data.name}</strong>`;
      cssClass = "text-green-500";
      alert("✅ สมัครสำเร็จ! ยินดีต้อนรับ " + data.name);
      document.getElementById("registerPhone").value = "";
    } else if (data.status === "exists") {
      text = `⚠️ เบอร์นี้ลงทะเบียนแล้วในชื่อ: <strong>${data.name}</strong>`;
      cssClass = "text-red-500";
      alert("⚠️ เบอร์นี้ได้สมัครแล้วในชื่อ: " + data.name);
    } else {
      text = `⚠️ สมัครไม่สำเร็จ กรุณาลองใหม่`;
      cssClass = "text-red-500";
      alert("⚠️ เกิดข้อผิดพลาดในการสมัคร");
    }
    resultDiv.innerHTML = `<p class="${cssClass}">${text}</p>`;
  })
  .catch(() => alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"));
}

// เช็กข้อมูลลูกค้า
function searchPhone() {
  const phone = document.getElementById("searchPhone").value.trim();
  const resultDiv = document.getElementById("result");
  const qrDiv = document.getElementById("qrcode");

  if (!/^0\d{9}$/.test(phone)) {
    alert("❌ กรุณากรอกเบอร์ให้ถูกต้อง");
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({ phone, action: "search" })
  })
  .then(res => res.json())
  .then(data => {
    resultDiv.innerHTML = "";
    qrDiv.innerHTML = "";

    if (data.found) {
      resultDiv.innerHTML = `
        <div class="flex flex-col items-center">
          <p>📱 เบอร์: ${data.phone}</p>
          <p>👤 ชื่อ: <strong id="customerName">${data.name}</strong></p>
          <p>⭐ แต้มสะสม: ${data.points}</p>
          <p>🎁 ของรางวัลล่าสุด: ${data.reward}</p>
          <p>🕰 เวลาที่แลกล่าสุด: ${data.time}</p>
          <button onclick="changeName('${data.phone}')" class="bg-yellow-400 text-white px-4 py-2 mt-3 rounded">🖋 เปลี่ยนชื่อ</button>
        </div>
      `;

      new QRCode(qrDiv, { text: data.phone, width: 180, height: 180 });
    } else {
      resultDiv.innerHTML = `<p class="text-red-500">❌ ไม่พบข้อมูล</p>`;
    }
  })
  .catch(() => alert("❌ เกิดข้อผิดพลาดในการค้นหา"));
}

// เปลี่ยนชื่อ
function changeName(phone) {
  const newName = prompt("🖋 กรอกชื่อใหม่:");
  if (!newName || newName.trim() === "") {
    alert("⚠️ คุณยังไม่ได้กรอกชื่อใหม่");
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({ phone, newName, action: "changeName" })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("customerName").innerText = newName;
      alert("✅ เปลี่ยนชื่อสำเร็จ!");
    } else {
      alert("❌ เปลี่ยนชื่อไม่สำเร็จ: " + (data.message || ""));
    }
  })
  .catch(() => alert("❌ เกิดข้อผิดพลาดในการเปลี่ยนชื่อ"));
}
