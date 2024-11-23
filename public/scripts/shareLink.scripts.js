/* sharedFile.Scripts.js */

/* share a file link by  whatsapp  */

let content = "this is sharable content";
const shareBtn = document.querySelectorAll("#shareBtn");

shareBtn.forEach((button, index) => {
  const fileDownloadUrl = button.dataset.sharefileUrl;
  button.addEventListener("click", () => {
    let whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(
      fileDownloadUrl
    )}`;
    window.location.href = whatsAppUrl;
  });
});
