function openPDF(fileName) {
  const viewer = document.getElementById("pdfViewer");
  const downloadBtn = document.getElementById("downloadBtn");

  // Go UP one level, then into syllabus folder
  const filePath = `../syllabus/${fileName}`;

  viewer.src = filePath + "#toolbar=0&navpanes=0";
  downloadBtn.href = filePath;
  downloadBtn.setAttribute("download", fileName);
}
