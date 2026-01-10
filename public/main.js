document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // BUTTON
  // =======================
  const joinBtn = document.getElementById("joinBtn");

  // =======================
  // COUNTDOWN TIMER
  // =======================
  const launchDate = new Date("2026-02-01T00:00:00").getTime();

  function startCountdown(){
    const now = new Date().getTime();
    const diff = launchDate - now;

    if(diff <= 0){
      updateTimer("00","00","00","00");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateTimer(days, hours, minutes, seconds);
  }

  function updateTimer(d,h,m,s){
    document.getElementById("days").innerText = String(d).padStart(2,"0");
    document.getElementById("hours").innerText = String(h).padStart(2,"0");
    document.getElementById("minutes").innerText = String(m).padStart(2,"0");
    document.getElementById("seconds").innerText = String(s).padStart(2,"0");
  }

  startCountdown();
  setInterval(startCountdown, 1000);

  // =======================
  // RESTORE JOINED STATE
  // =======================
  if(localStorage.getItem("qrkhata_joined") === "true"){
    setJoinedState();
  }

  // =======================
  // MOBILE INPUT BLOCK
  // =======================
  document.getElementById("mobile").addEventListener("input", function(){
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // =======================
  // JOIN WAITLIST
  // =======================
  window.joinWaitlist = async function(){

    const mobile = document.getElementById("mobile").value.trim();
    const mobileRegex = /^[6-9][0-9]{9}$/;

    if(!mobileRegex.test(mobile)){
  showToast(content[currentLang].invalidToast);
  return;
}

    joinBtn.innerText = "Joining...";
    joinBtn.disabled = true;

    try{
      const res = await fetch("/api/join", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ mobile })
      });

      const data = await res.json();

      

      if(res.status === 409){
      showToast(content[currentLang].alreadyToast);
      localStorage.setItem("qrkhata_joined","true");
      setJoinedState();
      return;
    }

    showToast(content[currentLang].successToast);
    localStorage.setItem("qrkhata_joined","true");
    setJoinedState();
    document.getElementById("mobile").value = "";

    }catch(err){
      console.error(err);
      joinBtn.innerText = "Join waitlist";
      joinBtn.disabled = false;
      showToast("Server error. Try again.", "info");
    }
  }

  // =======================
  // JOINED STATE
  // =======================
  function setJoinedState(){
  joinBtn.innerText = content[currentLang].joined;
  joinBtn.classList.add("joined");
  joinBtn.disabled = true;
}

  // =======================
  // TOAST
  // =======================
 function showToast(message){
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "toast show";
  setTimeout(()=> toast.className = "toast",4000);
}

});
let currentLang = localStorage.getItem("qrkhata_lang") || "en";

const content = {
  en: {
    title: "Get early access",
    subtitle: "India’s first credit discipline system. Join the waitlist and shape the future of udhaar for new Bharat.",
    join: "Join waitlist",
    joined: "Joined ✅",
    social: "Join 100+ others on the waitlist",
     linkedinPrefix: "Follow our journey on →",
     successToast: "🎉 Welcome! You are now a QRKhata Founding Member",
    alreadyToast: "🚀 You already joined QR Khata!",
    invalidToast: "Enter valid 10-digit Indian mobile number"
  },
  hi: {
    title: "सबसे पहले इस्तेमाल करने का मौका पाएं",
    subtitle: "भारत का पहला उधार को अनुशासित बनाने वाला सिस्टम।। उधार के भविष्य को बदलने के लिए वेटलिस्ट में जुड़ें।",
    join: "वेटलिस्ट में जुड़ें",
     joined: "आप जुड़ चुके हैं ✅",
    social: "100 से ज़्यादा लोग पहले ही जुड़ चुके हैं, आप भी जुड़ जाइए।",
    linkedinPrefix: "हमारी यात्रा का हिस्सा बनें",
     successToast: "🎉 आप अब QR Khata के फाउंडिंग मेंबर हैं",
    alreadyToast: "🚀 आप पहले ही QR Khata से जुड़ चुके हैं",
    invalidToast: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें"
  }
};

function setLang(lang){
  currentLang = lang;

  document.getElementById("title").innerText = content[lang].title;
  document.getElementById("subtitle").innerText = content[lang].subtitle;
  document.getElementById("joinBtn").innerText = content[lang].join;
  document.getElementById("socialText").innerText = content[lang].social;
  document.getElementById("linkedinPrefix").innerText = content[lang].linkedinPrefix;

  if(localStorage.getItem("qrkhata_joined") === "true"){
    setJoinedState();
  }

  localStorage.setItem("qrkhata_lang", lang);
}


// Restore selected language
const savedLang = localStorage.getItem("qrkhata_lang");
if(savedLang){
  setLang(savedLang);
}