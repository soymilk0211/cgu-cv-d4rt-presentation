const pptxgen = require("pptxgenjs");
const path = require("path");
const D = require("./slides_data.js");
const FIG = path.join(__dirname, "figs");
const OUT = path.join(__dirname, "D4RT_簡報_簡化版.pptx");
const C = { ink:"222222", mute:"555555", faint:"888888", line:"C8C8C8", accent:"7A2E0E" };
const FONT = "Noto Sans CJK TC";
const TOTAL = 12;
const SIZES = { "fig1.png":[606,506], "fig2.png":[1249,304], "fig3.png":[597,250], "fig4.png":[1231,528], "table1.png":[602,261], "table6.png":[598,197] };
const pres = new pptxgen();
pres.defineLayout({ name:"WIDE", width:13.333, height:7.5 }); pres.layout="WIDE";
pres.title="D4RT 簡化版報告"; pres.author="第17組 廖晢勛、林威宇";
function img(s,f,x,y,mw,mh){const [iw,ih]=SIZES[f];const ar=iw/ih;let w=mw,h=mw/ar;if(h>mh){h=mh;w=mh*ar;}s.addImage({path:path.join(FIG,f),x:x+(mw-w)/2,y:y+(mh-h)/2,w,h});}
function T(s,text,o){s.addText(text,Object.assign({fontFace:FONT,color:C.ink,margin:0,valign:"top"},o));}
function header(s,title,src){T(s,title,{x:0.5,y:0.3,w:12.3,h:0.6,fontSize:30,bold:true}); if(src)T(s,src,{x:0.5,y:0.92,w:12.3,h:0.3,fontSize:13,color:C.mute}); s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:1.28,w:12.3,h:0.012,fill:{color:C.line}});}
function footer(s,n){T(s,"D4RT    第 17 組    長庚大學電腦視覺",{x:0.5,y:7.12,w:9,h:0.25,fontSize:11,color:C.faint}); T(s,n+" / "+TOTAL,{x:10.5,y:7.12,w:2.3,h:0.25,fontSize:11,color:C.faint,align:"right"});}
function slide(n){const s=pres.addSlide(); const d=D[n-1]; s.addNotes(`【${d.who}｜${d.time}】\n`+d.say); return s;}
const CITE="圖表出處：Zhang et al., Efficiently Reconstructing Dynamic Scenes One D4RT at a Time, CVPR 2026，";

// 1 cover
{const s=slide(1);
 T(s,"CVPR 2026 Best Paper",{x:0.6,y:0.45,w:12,h:0.35,fontSize:15,bold:true,color:C.accent});
 T(s,"Efficiently Reconstructing Dynamic Scenes\nOne D4RT at a Time",{x:0.6,y:0.9,w:12.2,h:1.3,fontSize:34,bold:true});
 T(s,"IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2026\nColorado Convention Center, Denver, Colorado, United States    June 2026",{x:0.6,y:2.35,w:12.2,h:0.65,fontSize:15});
 T(s,"Chuhan Zhang, Guillaume Le Moing, Skanda Koppula, Ignacio Rocco, Liliane Momeni, Junyu Xie, Shuyang Sun, Rahul Sukthankar, Joëlle K. Barral, Raia Hadsell, Zoubin Ghahramani, Andrew Zisserman, Junlin Zhang, Mehdi S. M. Sajjadi",{x:0.6,y:3.15,w:12.2,h:0.9,fontSize:14});
 T(s,"Google DeepMind（另含 University College London、University of Oxford）",{x:0.6,y:4.08,w:12.2,h:0.3,fontSize:13,color:C.mute});
 s.addShape(pres.shapes.RECTANGLE,{x:0.6,y:4.6,w:12.1,h:0.012,fill:{color:C.line}});
 T(s,"報告人    第 17 組",{x:0.6,y:4.8,w:12,h:0.3,fontSize:14,color:C.mute});
 T(s,"廖晢勛  B1229009          林威宇  B1229010",{x:0.6,y:5.15,w:12,h:0.45,fontSize:22,bold:true});
 T(s,"指導教授    陳仁暉          長庚大學    電腦視覺",{x:0.6,y:5.72,w:12,h:0.35,fontSize:16});
 T(s,"專案頁    https://d4rt-paper.github.io/",{x:0.6,y:6.3,w:12,h:0.3,fontSize:13,color:C.mute});}

// 2 problem
{const s=slide(2); header(s,"普通影片  →  會動的 3D 世界",CITE+"Figure 1");
 T(s,"4D 重建\n＝ 三維空間 ＋ 時間",{x:0.5,y:1.7,w:5.6,h:1.3,fontSize:28,bold:true});
 T(s,"每個點多遠（深度、點雲）\n每個點跑去哪（三維軌跡）\n相機在哪、朝哪（相機參數）",{x:0.5,y:3.3,w:5.6,h:2,fontSize:20,color:C.mute,lineSpacingMultiple:1.3});
 T(s,"輸入：一段單鏡頭影片",{x:0.5,y:5.7,w:5.6,h:0.4,fontSize:18,color:C.accent,bold:true});
 img(s,"fig1.png",6.4,1.45,6.4,5.5); footer(s,2);}

// 3 old way
{const s=slide(3); header(s,"以前怎麼做：拼起來，再慢慢修","");
 const rows=[["多個模型接在一起","深度、運動分割… 各做各的（例：MegaSaM）"],["測試時再最佳化","為了讓結果一致，要再跑一輪很貴的計算"],["每個任務一個輸出頭","每一幀整張解碼；會動的部分沒有對應（例：VGGT）"]];
 rows.forEach((r,i)=>{const y=1.75+i*1.55; T(s,r[0],{x:0.8,y,w:11.5,h:0.55,fontSize:26,bold:true}); T(s,r[1],{x:0.8,y:y+0.6,w:11.5,h:0.5,fontSize:18,color:C.mute});});
 T(s,"→  又慢、又複雜",{x:0.8,y:6.35,w:11.5,h:0.5,fontSize:24,bold:true,color:C.accent}); footer(s,3);}

// 4 core idea
{const s=slide(4); header(s,"核心想法：先讀完影片，再按需發問",CITE+"Figure 2");
 img(s,"fig2.png",0.4,1.55,12.5,4.2);
 T(s,"① 編碼器讀完整段影片 → 場景表徵 F（只算一次，約 10 億參數）",{x:0.6,y:5.95,w:12.2,h:0.42,fontSize:19,bold:true});
 T(s,"② 輕量解碼器（1.44 億參數）：問一個 query，答一個三維點 P；每個 query 獨立、可平行",{x:0.6,y:6.42,w:12.2,h:0.42,fontSize:19,bold:true}); footer(s,4);}

// 5 query
{const s=slide(5); header(s,"Query 就是五個數字","論文第 2 節定義");
 T(s,"q = ( u, v, t_src, t_tgt, t_cam )",{x:0.5,y:1.7,w:12.3,h:0.9,fontSize:44,bold:true,align:"center"});
 T(s,"→  P = D(q, F) ∈ ℝ³",{x:0.5,y:2.65,w:12.3,h:0.6,fontSize:26,color:C.mute,align:"center"});
 const rows=[["u, v","畫面上的哪個點"],["t_src","這個點來自哪一幀"],["t_tgt","想知道它在哪個時間的位置"],["t_cam","用哪一幀的相機座標寫答案"]];
 rows.forEach((r,i)=>{const y=3.6+i*0.68; T(s,r[0],{x:2.4,y,w:2.4,h:0.55,fontSize:24,bold:true,color:C.accent}); T(s,r[1],{x:4.9,y,w:7,h:0.55,fontSize:22});});
 T(s,"三個時間可以不一樣 → 空間和時間拆開",{x:0.5,y:6.45,w:12.3,h:0.45,fontSize:20,bold:true,align:"center"}); footer(s,5);}

// 6 one interface
{const s=slide(6); header(s,"同一個介面，換個問法做別的事",CITE+"Table 1");
 img(s,"table1.png",0.3,1.6,7.6,5.2);
 const rows=[["深度","三個時間同一幀，取 Z"],["點雲","t_cam 固定，其他一起走"],["三維軌跡","固定一點，t_tgt＝t_cam 走完整段"],["相機外參","兩個座標系各問一次 → Umeyama"],["相機內參","由三維點反推焦距"]];
 rows.forEach((r,i)=>{const y=1.6+i*0.92; T(s,r[0],{x:8.1,y,w:4.8,h:0.4,fontSize:20,bold:true}); T(s,r[1],{x:8.1,y:y+0.42,w:4.8,h:0.4,fontSize:15,color:C.mute});});
 T(s,"沒有另外的相機輸出頭",{x:8.1,y:6.3,w:4.8,h:0.4,fontSize:17,bold:true,color:C.accent}); footer(s,6);}

// 7 qualitative
{const s=slide(7); header(s,"會動的場景：別的方法出錯的地方",CITE+"Figure 4");
 img(s,"fig4.png",0.4,1.45,12.5,4.95);
 T(s,"MegaSaM：天鵝重複印        π³：花重建失敗        SpatialTrackerV2：被擋住處留洞        D4RT：所有像素都進來",{x:0.4,y:6.5,w:12.5,h:0.4,fontSize:15,color:C.mute,align:"center"}); footer(s,7);}

// 8 speed
{const s=slide(8); header(s,"速度：比現有方法快很多",CITE+"Figure 3、Table 3；單張 A100");
 img(s,"fig3.png",0.3,1.6,7.2,5.3);
 T(s,"相機姿勢",{x:7.8,y:1.6,w:5,h:0.45,fontSize:20,bold:true});
 T(s,"> 200 FPS\nVGGT 的 9 倍、MegaSaM 的 100 倍",{x:7.8,y:2.1,w:5,h:1.1,fontSize:20});
 T(s,"三維軌跡（24 FPS 下的條數）",{x:7.8,y:3.5,w:5,h:0.45,fontSize:20,bold:true});
 T(s,"D4RT  1,570\nSpatialTrackerV2  84\nDELTA  5",{x:7.8,y:4.0,w:5,h:1.3,fontSize:20});
 T(s,"論文：比其他方法快 18–300 倍",{x:7.8,y:5.6,w:5,h:0.45,fontSize:18,bold:true,color:C.accent}); footer(s,8);}

// 9 accuracy
{const s=slide(9); header(s,"準確度：大多最好，但不是每一格",CITE+"Table 6（藍底＝最佳）");
 img(s,"table6.png",0.3,1.6,8.0,5.3);
 T(s,"大多最好",{x:8.6,y:1.6,w:4.3,h:0.45,fontSize:20,bold:true});
 T(s,"Re10K AUC：83.5\n（次佳 π³ 78.7）",{x:8.6,y:2.1,w:4.3,h:0.9,fontSize:18});
 T(s,"沒贏的格子",{x:8.6,y:3.3,w:4.3,h:0.45,fontSize:20,bold:true,color:C.accent});
 T(s,"ScanNet RPE-R\nπ³ 0.291 ＜ D4RT 0.302",{x:8.6,y:3.8,w:4.3,h:0.9,fontSize:18});
 T(s,"其他表也有：\n追蹤 ADT、Bonn 深度",{x:8.6,y:4.95,w:4.3,h:0.9,fontSize:18,color:C.mute}); footer(s,9);}

// 10 limits
{const s=slide(10); header(s,"限制與我們的看法","論文正文沒有獨立的限制章節；★ 為我們自己的看法");
 const rows=[["★ 重建，不是生成","query 都從影片裡的像素出發；整段沒拍到的背面不會生出來"],["沒看到官方程式碼與模型","論文與專案頁都沒提供；訓練含內部資料；只用公開資料的結果在附錄，正文看不到"],["訓練用短片段","48 幀、256×256；長影片、高解析度正文沒分析"],["★ 一致性是隱含學的","沒有明確幾何約束，出錯時較難解釋"]];
 rows.forEach((r,i)=>{const y=1.65+i*1.3; T(s,r[0],{x:0.8,y,w:11.8,h:0.5,fontSize:24,bold:true}); T(s,r[1],{x:0.8,y:y+0.55,w:11.8,h:0.45,fontSize:17,color:C.mute});}); footer(s,10);}

// 11 summary
{const s=slide(11); header(s,"小結","");
 T(s,"把深度、點雲、追蹤、相機\n收成同一個問題：",{x:0.8,y:1.8,w:11.8,h:1.3,fontSize:28});
 T(s,"「這個點，在這個時間，三維位置在哪？」",{x:0.8,y:3.25,w:11.8,h:0.8,fontSize:34,bold:true,color:C.accent});
 T(s,"先讀完變成 F  →  輕量解碼器按需回答  →  統一、又快\n整體最先進，但不是每格第一",{x:0.8,y:4.5,w:11.8,h:1.2,fontSize:22,color:C.mute,lineSpacingMultiple:1.3}); footer(s,11);}

// 12 QA
{const s=slide(12);
 T(s,"Q & A",{x:0.5,y:2.5,w:12.3,h:1.2,fontSize:60,bold:true,align:"center"});
 T(s,"謝謝聆聽    第 17 組  廖晢勛、林威宇",{x:0.5,y:4.0,w:12.3,h:0.5,fontSize:20,color:C.mute,align:"center"});
 T(s,"圖表皆引自 Zhang et al., CVPR 2026；專案頁 https://d4rt-paper.github.io/",{x:0.5,y:6.5,w:12.3,h:0.35,fontSize:12,color:C.faint,align:"center"});}

pres.writeFile({fileName:OUT}).then(()=>console.log("wrote",OUT));
