const pptxgen = require("pptxgenjs");
const path = require("path");
const D = require("./slides_data.js");
const FIG = path.join(__dirname, "figs");
const OUT = path.join(__dirname, "D4RT_簡報.pptx");
const FONT = "Noto Sans CJK TC";
const INK = "202124", BODY = "3C4043", GRAY = "80868B";
const SIZES = { "fig1.png":[727,725], "fig2.png":[1409,570], "fig3.png":[751,475], "fig4.png":[1435,810], "table1.png":[728,363], "table6.png":[759,357] };
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in, like Google Slides
pres.title = "Efficiently Reconstructing Dynamic Scenes One D4RT at a Time";
pres.author = "廖晢勛、林威宇";
function img(s,f,x,y,mw,mh){const [iw,ih]=SIZES[f];const ar=iw/ih;let w=mw,h=mw/ar;if(h>mh){h=mh;w=mh*ar;}s.addImage({path:path.join(FIG,f),x:x+(mw-w)/2,y,w,h});}
function title(s,t){s.addText(t,{x:0.45,y:0.28,w:9.1,h:0.6,fontFace:FONT,fontSize:24,color:INK,margin:0,valign:"top"});}
function bullets(s,items,o){ // items: string or [string, level]
  const arr=items.map(it=>{const [t,l]=Array.isArray(it)?it:[it,0];return {text:t,options:{bullet:l?{indent:14}:{indent:14},indentLevel:l,fontSize:l?12:o.fs||14,color:l?GRAY:BODY,breakLine:true,paraSpaceAfter:4}};});
  s.addText(arr,Object.assign({fontFace:FONT,margin:0,valign:"top"},o));}
function cite(s){s.addText("Zhang et al., CVPR 2026",{x:0.45,y:5.3,w:4,h:0.2,fontFace:FONT,fontSize:8,color:GRAY,margin:0});}
function slide(n){const s=pres.addSlide();const d=D[n-1];s.addNotes(`[${d.who} ${d.time}]\n`+d.say);return s;}
// Rich text helper: segments with bold
function rich(parts){return parts.map(p=>typeof p==="string"?{text:p}:{text:p[0],options:{bold:true}});}

// 1 cover
{const s=slide(1);
 s.addText("Efficiently Reconstructing Dynamic Scenes\nOne D4RT at a Time",{x:0.45,y:0.7,w:9.1,h:1.2,fontFace:FONT,fontSize:28,color:INK,margin:0,valign:"top"});
 s.addText("Chuhan Zhang, Guillaume Le Moing, Skanda Koppula, Ignacio Rocco, Liliane Momeni, Junyu Xie, Shuyang Sun, Rahul Sukthankar, Joëlle K. Barral, Raia Hadsell, Zoubin Ghahramani, Andrew Zisserman, Junlin Zhang, Mehdi S. M. Sajjadi",{x:0.45,y:2.05,w:9.1,h:0.7,fontFace:FONT,fontSize:11,color:BODY,margin:0,valign:"top"});
 s.addText("Google DeepMind, University College London, University of Oxford",{x:0.45,y:2.78,w:9.1,h:0.25,fontFace:FONT,fontSize:11,color:BODY,margin:0});
 s.addText("CVPR 2026 (Best Paper), Denver, Colorado, United States, June 2026",{x:0.45,y:3.1,w:9.1,h:0.25,fontFace:FONT,fontSize:11,color:BODY,margin:0});
 s.addText("報告人：第 17 組　廖晢勛 B1229009、林威宇 B1229010",{x:0.45,y:4.35,w:9.1,h:0.3,fontFace:FONT,fontSize:13,color:INK,margin:0});
 s.addText("Project page: https://d4rt-paper.github.io/",{x:0.45,y:4.7,w:9.1,h:0.25,fontFace:FONT,fontSize:10,color:GRAY,margin:0});}

// 2 motivation
{const s=slide(2); title(s,"Motivation");
 bullets(s,["影片裡的東西會動，相機也在動","想要的不只是 depth，還有：",["每個點之後跑去哪（3D track）",1],["每一幀的相機 pose、intrinsics",1],"3D + 時間 → 論文叫 4D reconstruction","輸入：一般的單鏡頭影片"],{x:0.45,y:1.05,w:4.3,h:3.8,fs:15});
 img(s,"fig1.png",4.95,0.95,4.6,4.3); cite(s);}

// 3 related work
{const s=slide(3); title(s,"Related work");
 s.addText([
  {text:"MegaSaM：",options:{bold:true}},{text:"組合多個現成模型（depth、motion segmentation），測試時還要做很貴的 optimization",options:{breakLine:true}},
  {text:"VGGT：",options:{bold:true}},{text:"feedforward，但不同輸出用不同的 decoder head，也沒有動態物體的對應",options:{breakLine:true}},
  {text:"SpatialTrackerV2：",options:{bold:true}},{text:"有處理動態，但不是單一階段，要反覆 refine",options:{breakLine:true}},
 ].map(x=>x),{x:0.45,y:1.1,w:8.8,h:2.6,fontFace:FONT,fontSize:15,color:BODY,margin:0,valign:"top",paraSpaceAfter:14,bullet:true});
 cite(s);}

// 4 method
{const s=slide(4); title(s,"Method");
 bullets(s,["Encoder 把整段影片讀成 global scene representation F（只算一次）","Decoder 很小，每個 query 各自對 F 做 cross-attention，輸出一個 3D 點 P"],{x:0.45,y:0.95,w:9.1,h:0.8,fs:13});
 img(s,"fig2.png",0.45,1.8,9.1,3.45); cite(s);}

// 5 query
{const s=slide(5); title(s,"Query");
 s.addText("q = (u, v, t_src, t_tgt, t_cam)　→　P = D(q, F)",{x:0.45,y:1.05,w:9.1,h:0.5,fontFace:FONT,fontSize:20,color:INK,margin:0});
 bullets(s,["(u, v)：畫面上的位置","t_src：這個點在哪一幀被看到","t_tgt：想知道它在哪個時間的位置","t_cam：答案用哪一幀的相機座標表示","三個時間可以不一樣，所以物體在動也問得到"],{x:0.45,y:1.85,w:9.1,h:3.0,fs:17});
 s.addText("Encoder 約 10 億參數，decoder 1.44 億參數",{x:0.45,y:4.75,w:9.1,h:0.25,fontFace:FONT,fontSize:11,color:GRAY,margin:0}); cite(s);}

// 6 one decoder
{const s=slide(6); title(s,"Method - 一個 decoder 做很多事");
 img(s,"table1.png",0.3,1.0,5.2,3.4);
 bullets(s,["Depth：三個時間都同一幀，取 Z","Point cloud：t_cam 固定","3D track：t_tgt = t_cam 從 1 走到 T","Extrinsics：同一批點問兩個相機座標，用 Umeyama 解","Intrinsics：從 3D 點反推 focal length","沒有另外的 camera head"],{x:5.7,y:1.05,w:3.95,h:4.0,fs:13});
 cite(s);}

// 7 qualitative
{const s=slide(7); title(s,"Experiments");
 s.addText("Qualitative：MegaSaM 天鵝重複、π³ 花沒重建出來、SpatialTrackerV2 被擋住的地方有洞",{x:0.45,y:0.9,w:9.1,h:0.3,fontFace:FONT,fontSize:12,color:BODY,margin:0});
 img(s,"fig4.png",0.3,1.25,9.4,4.05); cite(s);}

// 8 speed
{const s=slide(8); title(s,"Experiments - speed");
 img(s,"fig3.png",0.25,0.95,5.7,4.2);
 bullets(s,["Pose > 200 FPS（一張 A100）","VGGT 的 9 倍、MegaSaM 的 100 倍","Table 3：維持 24 FPS 時能算的完整 3D track 數",["D4RT 1,570",1],["STv2 84、DELTA 5",1],"論文說快 18–300 倍"],{x:6.05,y:1.1,w:3.65,h:3.9,fs:14});
 cite(s);}

// 9 pose
{const s=slide(9); title(s,"Experiments - camera pose");
 img(s,"table6.png",0.25,0.95,6.0,4.2);
 bullets(s,["大部分欄位最好","Re10K AUC 83.5（π³ 78.7）","ScanNet RPE-R：π³ 0.291 比 D4RT 0.302 好","Tracking 的 ADT、Bonn depth 也有別的方法比較好"],{x:6.4,y:1.1,w:3.3,h:3.9,fs:14});
 cite(s);}

// 10 limitations
{const s=slide(10); title(s,"Limitations");
 bullets(s,["論文正文沒有獨立的 limitation 章節，以下部分是我們的想法",
  "重建，不是生成：query 都從影片裡的 pixel 出發，整段沒拍到的地方（例如背面）給不出來",["我們的推論，論文沒寫",1],
  "論文和專案頁都沒看到官方 code / model；訓練有用內部資料",["只用公開資料的結果在附錄，正文沒有",1],
  "訓練是 48 幀、256×256 的短片段，長影片、高解析度沒分析",
  "一致性是 F 隱含學出來的，沒有明確的幾何約束，出錯時比較難解釋（我們的想法）"],{x:0.45,y:1.0,w:9.1,h:4.2,fs:15});}

// 11 summary
{const s=slide(11); title(s,"Summary");
 bullets(s,["Encoder 先把影片讀成 F，小的 decoder 再回答 query","Depth、point cloud、3D track、camera 都用同一套 query 得到","速度比之前的方法快很多（Fig. 3、Table 3）","準確度大部分最好，但有幾項輸給 π³、SpatialTrackerV2"],{x:0.45,y:1.1,w:9.1,h:3.5,fs:18});}

pres.writeFile({fileName:OUT}).then(()=>console.log("wrote",OUT));
