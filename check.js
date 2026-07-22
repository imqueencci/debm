// 배포 전 JS 문법 검사 스크립트
const fs = require('fs');
const files = ['reset21.html', 'reset21-admin.html'];
let allOk = true;

files.forEach(file => {
  const html = fs.readFileSync(`/home/claude/fitti_deploy/${file}`, 'utf8');
  const idx = html.lastIndexOf('<script>');
  const end = html.lastIndexOf('</script>');
  if(idx === -1){ console.log(`✓ ${file}: script 없음`); return; }
  const code = html.substring(idx+8, end);
  try{
    new Function(code);
    console.log(`✓ ${file}: JS OK`);
  } catch(e) {
    console.log(`✗ ${file}: 오류 - ${e.message}`);
    allOk = false;
  }
});

process.exit(allOk ? 0 : 1);
