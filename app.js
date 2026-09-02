const promptEl=document.getElementById("prompt");
const ratioEl=document.getElementById("ratio");
const durationEl=document.getElementById("duration");
const generateBtn=document.getElementById("generateBtn");
const statusCard=document.getElementById("statusCard");
const resultCard=document.getElementById("resultCard");
const statusTitle=document.getElementById("statusTitle");
const statusText=document.getElementById("statusText");
const video=document.getElementById("video");
const download=document.getElementById("download");

function showStatus(title,text){statusCard.classList.remove("hidden");statusTitle.textContent=title;statusText.textContent=text}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

generateBtn.addEventListener("click", async ()=>{
  const prompt=promptEl.value.trim();
  if(!prompt){alert("Please describe the video you want.");promptEl.focus();return}
  generateBtn.disabled=true;
  resultCard.classList.add("hidden");
  showStatus("Starting generation…","Sending your prompt to the video AI.");
  try{
    const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      prompt, ratio:ratioEl.value, duration:Number(durationEl.value)
    })});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||"Could not start generation.");
    const taskId=data.id;
    for(let attempt=0;attempt<90;attempt++){
      await sleep(5500);
      const check=await fetch("/api/status?id="+encodeURIComponent(taskId));
      const task=await check.json();
      if(!check.ok) throw new Error(task.error||"Could not check video status.");
      if(task.status==="SUCCEEDED"){
        const url=task.output?.[0];
        if(!url) throw new Error("The AI finished but returned no video.");
        video.src=url; download.href=url;
        resultCard.classList.remove("hidden");
        statusCard.classList.add("hidden");
        generateBtn.disabled=false;
        return;
      }
      if(task.status==="FAILED"||task.status==="CANCELED"){
        throw new Error("Video generation failed. Please try another prompt.");
      }
      statusTitle.textContent="Generating your video…";
      statusText.textContent=`AI status: ${String(task.status||"PROCESSING").toLowerCase()}. Please wait.`;
    }
    throw new Error("Generation is taking longer than expected. Check again later.");
  }catch(err){
    statusTitle.textContent="Something went wrong";
    statusText.textContent=err.message;
    generateBtn.disabled=false;
  }
});
