const D=require('./slides_data.js');
let md=`# D4RT 講稿\n\n第 17 組　廖晢勛、林威宇\n\n- 講完大約 12 分鐘。\n- 分工：廖晢勛講第 1–6 頁（大約 6:20），林威宇講第 7–11 頁（大約 5:40）。\n- 不用逐字背，照意思講就好。數字照稿講，全部來自論文的圖表。\n- 簡報備註欄也放了同一份講稿。\n\n| 頁 | 標題 | 時間 | 誰講 |\n| --- | --- | --- | --- |\n`;
D.forEach(d=>md+=`| ${d.n} | ${d.title} | ${d.time} | ${d.who} |\n`);
md+=`| | 合計 | 12:00 | |\n\n---\n\n`;
D.forEach(d=>{md+=`## ${d.n}. ${d.title}（${d.time}，${d.who}）\n\n${d.say}\n\n`;});
md+=`---\n\n數字出處：Figure 3（>200 FPS，是 VGGT 的 9 倍、MegaSaM 的 100 倍），Table 3（24 FPS 時 1,570／84／5；快 18–300 倍），Table 6（Re10K AUC 83.5 對 78.7；ScanNet RPE-R 0.291 對 0.302）。參數量和訓練設定出自論文第 2 節。\n`;
require('fs').writeFileSync('講稿.md',md);
