(()=>{document.querySelectorAll('.sns-link').forEach((link)=>{link.addEventListener('mouseenter',(e)=>{
        e.target.style.color = "rgb(0,162,230)";
        })});
    document.querySelectorAll('.sns-link').forEach((link)=>{link.addEventListener('mouseleave',(e)=>{
        e.target.style.color = "rgb(255,255,255)";
        })});
})();