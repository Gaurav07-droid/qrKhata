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
      showToast("Enter valid 10-digit Indian mobile number", "info");
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

      localStorage.setItem("qrkhata_joined","true");
      setJoinedState();
      showToast(data.message, res.ok ? "success" : "info");

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
    joinBtn.innerText = "Joined ✅";
    joinBtn.classList.add("joined");
    joinBtn.disabled = true;
  }

  // =======================
  // TOAST
  // =======================
  function showToast(message,type){
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    setTimeout(()=> toast.className = "toast",4000);
  }

});
