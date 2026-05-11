import React from "react";
import { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";

// ─────────────────────────────────────────────
//  CRAFTIX  |  by Sanjeev Karthikeya.A
//  Paste into StackBlitz App.js → Save → Share
// ─────────────────────────────────────────────

const ADMIN = { u:"admin", p:"craftix2024" };

const DEF_PRODS = [
  { id:1, name:"Geometric Planter",  tag:"Home Decor",
    img:"https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&h=380",
    desc:"Minimalist angular planter for succulents and small plants.", price:1210 },
  { id:2, name:"Custom Name Tag",    tag:"Personalized",
    img:"https://images.unsplash.com/photo-1529203915787-cc54fa70a428?auto=format&fit=crop&w=500&h=380",
    desc:"3D printed magnetic alphabet letters — stick to any fridge or surface.", price:538 },
  { id:3, name:"Desk Organiser",     tag:"Workspace",
    img:"https://images.unsplash.com/photo-1496128745012-b87f5ccd9cd4?auto=format&fit=crop&w=500&h=380",
    desc:"Multi-slot 3D printed organiser for pens, cards and desk essentials.", price:1478 },
  { id:4, name:"Keychain Charm",     tag:"Accessories",
    img:"https://images.unsplash.com/photo-1676276550349-580c49631496?auto=format&fit=crop&w=500&h=380",
    desc:"Custom 3D printed keychain — personalised with your name or brand.", price:403 },
  { id:5, name:"Phone Stand",        tag:"Workspace",
    img:"https://images.unsplash.com/photo-1698314440355-eaf5ff14899c?auto=format&fit=crop&w=500&h=380",
    desc:"Sturdy 3D printed angled phone stand for any desk. Fits all phones.", price:941 },
  { id:6, name:"Wall Hook Set",      tag:"Home Decor",
    img:"https://images.unsplash.com/photo-1534702718617-c141fb9f99d0?auto=format&fit=crop&w=500&h=380",
    desc:"Set of 3 strong 3D printed wall hooks for coats, bags or shoes.", price:1075 },
];

const FALLBACKS = {
  1:"https://picsum.photos/seed/planter/500/380",
  2:"https://picsum.photos/seed/letters/500/380",
  3:"https://picsum.photos/seed/deskorg/500/380",
  4:"https://picsum.photos/seed/keychain/500/380",
  5:"https://picsum.photos/seed/phonestand/500/380",
  6:"https://picsum.photos/seed/wallhook/500/380",
};

const salePrice = p => Math.round(p * 0.8);
const MATS = ["PLA (Standard)","PLA+ (Durable)","PETG (Flexible)","Resin (Fine Detail)"];
const COLS = ["White","Matte Black","Warm Grey","Sandstone","Cream","Sage Green","Terracotta","Navy"];
const FINS = ["Matte","Satin","Glossy"];

const sg = k => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch { return null; } };
const ss = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;background:#F9F7F4;color:#1C1917;font-size:15px}
  button{cursor:pointer}
  .prod-card:hover .prod-img{transform:scale(1.05)}
  .prod-img{transition:transform .45s ease;width:100%;height:220px;object-fit:cover;display:block}
  .nav-link:hover{color:#1C1917!important}
  .order-btn:hover{background:#1C1917!important;color:#fff!important}
`;

export default function App() {
  const [page,setPage]       = useState("home");
  const [user,setUser]       = useState(null);
  const [isAdmin,setIsAdmin] = useState(false);
  const [modal,setModal]     = useState(null);
  const [prods,setProds]     = useState(DEF_PRODS);
  const [users,setUsers]     = useState([]);
  const [orders,setOrders]   = useState([]);
  const [toast,setToast]     = useState(null);
  const [ltab,setLtab]       = useState("login");
  const [oprod,setOprod]     = useState(null);
  const [cf,setCf] = useState({item:"",mat:MATS[0],col:COLS[0],fin:FINS[0],len:"",brd:"",notes:""});
  const [lf,setLf] = useState({u:"",p:""});
  const [sf,setSf] = useState({u:"",e:"",p:""});
  const [lerr,setLerr] = useState("");
  const [ap,setAp] = useState({});

  useEffect(()=>{
    const sp=sg("products_craftix"); if(sp)setProds(sp);
    const su=sg("users_craftix");    if(su)setUsers(su);
    const so=sg("orders_craftix");   if(so)setOrders(so);
    const s=document.createElement("style"); s.textContent=css; document.head.appendChild(s);
  },[]);

  const showToast  = m => { setToast(m); setTimeout(()=>setToast(null),2800); };
  const go         = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const closeModal = ()=> setModal(null);

  const doLogin = () => {
    if(lf.u===ADMIN.u&&lf.p===ADMIN.p){setUser({u:"Admin",e:"admin@craftix.in"});setIsAdmin(true);setModal(null);showToast("Welcome back, Admin ✦");return;}
    const f=users.find(x=>x.u===lf.u&&x.p===lf.p);
    if(f){setUser(f);setIsAdmin(false);setModal(null);showToast(`Welcome back, ${f.u} ✦`);}
    else setLerr("Invalid username or password.");
  };

  const doSignup = () => {
    if(!sf.u||!sf.e||!sf.p){setLerr("All fields required.");return;}
    if(users.find(x=>x.u===sf.u)){setLerr("Username already taken.");return;}
    const nu={u:sf.u,e:sf.e,p:sf.p};
    const nu2=[...users,nu]; setUsers(nu2); ss("users_craftix",nu2);
    setUser(nu);setIsAdmin(false);setModal(null);showToast(`Welcome to Craftix, ${sf.u} ✦`);
  };

  const openOrder = p => {
    if(!user){setModal("login");setLtab("login");setLerr("");return;}
    setOprod(p); setCf(f=>({...f,item:p?p.name:"Custom Item",len:"",brd:"",notes:""})); setModal("order");
  };

  const doOrder = () => {
    const l=parseFloat(cf.len), b=parseFloat(cf.brd);
    if(!cf.len||!cf.brd){showToast("Please enter dimensions.");return;}
    if(l>5||b>5||l<=0||b<=0){showToast("Dimensions must be 0.1–5.0 inches.");return;}
    const o={id:"CX"+Date.now().toString().slice(-6),user:user.u,item:cf.item,mat:cf.mat,col:cf.col,fin:cf.fin,l,b,notes:cf.notes,
      price:oprod?salePrice(oprod.price):806,status:"Pending",
      date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})};
    const no=[...orders,o]; setOrders(no); ss("orders_craftix",no);
    setModal(null); go("orders"); showToast(`Order ${o.id} placed! We'll be in touch ✦`);
  };

  const openAdmin = () => { const a={}; prods.forEach(p=>a[p.id]=p.price); setAp(a); setModal("admin"); };
  const saveAdmin = () => {
    const u=prods.map(p=>({...p,price:parseFloat(ap[p.id])||p.price}));
    setProds(u); ss("products_craftix",u); setModal(null); showToast("Prices updated ✦");
  };
  const logout = () => { setUser(null); setIsAdmin(false); showToast("Signed out. See you soon ✦"); };

  const S = {
    nav:{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(249,247,244,0.96)",backdropFilter:"blur(14px)",borderBottom:"1px solid #E8E4DF",height:64,display:"flex",alignItems:"center",padding:"0 32px"},
    navInner:{width:"100%",maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"},
    logo:{fontFamily:"'Playfair Display',serif",fontSize:21,color:"#1C1917",cursor:"pointer",border:"none",background:"none"},
    navLinks:{display:"flex",alignItems:"center",gap:20},
    navLink:a=>({fontSize:12,fontWeight:400,color:a?"#1C1917":"#78716C",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase",border:"none",background:"none",fontFamily:"'Inter',sans-serif"}),
    btnDark:{fontSize:12,fontWeight:600,color:"#fff",background:"#1C1917",border:"none",padding:"9px 18px",letterSpacing:"0.05em",fontFamily:"'Inter',sans-serif"},
    btnOut:{fontSize:12,fontWeight:600,color:"#1C1917",background:"transparent",border:"1px solid #E8E4DF",padding:"9px 18px",letterSpacing:"0.05em",fontFamily:"'Inter',sans-serif"},
    main:{paddingTop:64},
    hero:{minHeight:"92vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 24px",background:"linear-gradient(160deg,#F9F7F4 50%,#EEE6DC)"},
    badge:{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#B5906B",background:"#F5EDE3",padding:"6px 14px",marginBottom:28},
    h1:{fontFamily:"'Playfair Display',serif",fontSize:"clamp(38px,6vw,72px)",fontWeight:400,lineHeight:1.1,maxWidth:720,margin:"0 auto 22px"},
    heroSub:{fontSize:17,fontWeight:300,color:"#78716C",maxWidth:460,margin:"0 auto 40px",lineHeight:1.8},
    heroActions:{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"},
    bigBtnDark:{fontSize:13,fontWeight:600,color:"#fff",background:"#1C1917",border:"none",padding:"14px 32px",letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Inter',sans-serif"},
    bigBtnLight:{fontSize:13,fontWeight:600,color:"#1C1917",background:"transparent",border:"1px solid #C8C0B8",padding:"14px 32px",letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Inter',sans-serif"},
    stats:{marginTop:56,display:"flex",gap:48,justifyContent:"center",flexWrap:"wrap"},
    sec:{padding:"88px 24px"},
    si:{maxWidth:1200,margin:"0 auto"},
    sLbl:{fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"#B5906B",marginBottom:10},
    sTitle:{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3.5vw,42px)",fontWeight:400,lineHeight:1.2,marginBottom:52},
    grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:2},
    card:{background:"#fff",display:"flex",flexDirection:"column",overflow:"hidden",border:"1px solid #E8E4DF"},
    cardBody:{padding:"24px 28px 28px",display:"flex",flexDirection:"column",gap:12,flex:1},
    overlay:{position:"fixed",inset:0,background:"rgba(28,25,23,.65)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24},
    mBox:{background:"#fff",padding:44,width:"100%",maxWidth:440,position:"relative",maxHeight:"90vh",overflowY:"auto"},
    mBoxW:{background:"#fff",padding:44,width:"100%",maxWidth:520,position:"relative",maxHeight:"90vh",overflowY:"auto"},
    fg:{display:"flex",flexDirection:"column",gap:7,marginBottom:20},
    lbl:{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#78716C"},
    inp:{fontFamily:"'Inter',sans-serif",fontSize:14,color:"#1C1917",background:"#F9F7F4",border:"1px solid #E8E4DF",padding:"11px 15px",outline:"none"},
    subBtn:{width:"100%",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#fff",background:"#1C1917",border:"none",padding:15,fontFamily:"'Inter',sans-serif",marginTop:6},
    frow:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20},
    toast:{position:"fixed",bottom:28,right:28,zIndex:999,background:"#1C1917",color:"#fff",padding:"13px 22px",fontSize:13,fontWeight:500},
    citem:{display:"flex",gap:16,alignItems:"flex-start",marginBottom:26},
    cicon:{width:42,height:42,background:"#F5EDE3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0},
    tab:a=>({flex:1,fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:a?"#1C1917":"#78716C",background:"none",border:"none",borderBottom:a?"2px solid #1C1917":"2px solid transparent",padding:10,fontFamily:"'Inter',sans-serif",marginBottom:-1}),
    footer:{background:"#1C1917",color:"rgba(255,255,255,.45)",textAlign:"center",padding:"36px 24px",fontSize:11,letterSpacing:"0.06em",lineHeight:2},
    saleBadge:{display:"inline-block",background:"#C0392B",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:"0.1em",padding:"3px 8px"},
    strike:{fontSize:13,color:"#A8A09A",textDecoration:"line-through",fontWeight:300},
  };

  const Img = ({p,className,style}) => {
    const [src,setSrc] = useState(p.img);
    return <img className={className} style={style} src={src} alt={p.name} onError={()=>setSrc(FALLBACKS[p.id])}/>;
  };

  const PriceBlock = ({price,big}) => (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:big?28:22,fontWeight:700,color:"#C0392B"}}>
          ₹{salePrice(price)}<span style={{fontSize:12,fontWeight:300,color:"#78716C"}}>/unit</span>
        </span>
        <span style={S.saleBadge}>Extra 20% OFF</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:12,color:"#78716C"}}>Was</span>
        <span style={S.strike}>₹{price}</span>
        <span style={{fontSize:11,color:"#5A8A5A",fontWeight:600}}>Already 20% reduced</span>
      </div>
    </div>
  );

  const Nav = () => (
    <nav style={S.nav}>
      <div style={S.navInner}>
        <button style={S.logo} onClick={()=>go("home")}>Craft<span style={{color:"#B5906B"}}>ix</span></button>
        <div style={S.navLinks}>
          {["home","products","custom","orders","contact"].map(p=>(
            <button key={p} className="nav-link" style={S.navLink(page===p)} onClick={()=>go(p)}>
              {p==="custom"?"Custom Order":p==="orders"?"My Orders":p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
          {isAdmin&&<button style={S.btnOut} onClick={openAdmin}>⚙ Admin</button>}
          {user
            ?<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}>
               <strong>{user.u}</strong>
               <button style={S.btnOut} onClick={logout}>Sign Out</button>
             </div>
            :<button style={S.btnDark} onClick={()=>{setModal("login");setLtab("login");setLerr("");}}>Sign In</button>
          }
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <div style={S.hero}>
      <div>
        <div style={S.badge}>✦ Made to Order · 3D Printed in India</div>
        <h1 style={S.h1}>Objects shaped with<br/><em style={{fontStyle:"italic",color:"#B5906B"}}>intention</em> &amp; precision</h1>
        <p style={S.heroSub}>Custom 3D printed pieces to your exact spec — up to 5 × 5 inches. Minimal. Refined. Yours.</p>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"#C0392B",color:"#fff",padding:"10px 24px",marginBottom:32,fontSize:13,fontWeight:600,letterSpacing:"0.06em"}}>
          🎉 LIMITED TIME — 20% OFF ALL PRODUCTS
        </div>
        <div style={S.heroActions}>
          <button style={S.bigBtnDark} onClick={()=>go("custom")}>Start Custom Order</button>
          <button style={S.bigBtnLight} onClick={()=>go("products")}>View Catalogue</button>
        </div>
        <div style={S.stats}>
          {[["5″","Max Size"],["4","Materials"],["8","Colours"],["48h","Avg Turnaround"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:32}}>{n}</div>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.12em",color:"#78716C",fontWeight:600,marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Products = () => (
    <section style={{...S.sec,background:"#F9F7F4"}}>
      <div style={S.si}>
        <div style={S.sLbl}>Our Catalogue</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:52}}>
          <div style={S.sTitle}>Popular <em style={{fontStyle:"italic"}}>Printed Items</em></div>
          <div style={{background:"#C0392B",color:"#fff",padding:"8px 18px",fontSize:12,fontWeight:700,letterSpacing:"0.1em"}}>🎉 20% OFF — LIMITED TIME</div>
        </div>
        <div style={S.grid}>
          {prods.map(p=>(
            <div key={p.id} className="prod-card" style={{...S.card,position:"relative"}}>
              <div style={{position:"absolute",top:14,right:0,zIndex:3,background:"#C0392B",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:"0.08em",padding:"5px 14px 5px 10px",clipPath:"polygon(8px 0%,100% 0%,100% 100%,8px 100%,0% 50%)"}}>20% OFF</div>
              {isAdmin&&<button onClick={openAdmin} style={{position:"absolute",top:14,left:12,zIndex:4,fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#B5906B",background:"#F5EDE3",border:"none",padding:"4px 10px",fontFamily:"'Inter',sans-serif"}}>Edit Price</button>}
              <div style={{overflow:"hidden",position:"relative"}}>
                <Img p={p} className="prod-img"/>
                <div style={{position:"absolute",top:isAdmin?40:14,left:14,zIndex:2,fontSize:9,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#B5906B",background:"rgba(249,247,244,0.92)",padding:"4px 10px"}}>{p.tag}</div>
              </div>
              <div style={S.cardBody}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20}}>{p.name}</div>
                <div style={{fontSize:13,color:"#78716C",lineHeight:1.65}}>{p.desc}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto",paddingTop:8,flexWrap:"wrap",gap:10}}>
                  <PriceBlock price={p.price}/>
                  <button className="order-btn" onClick={()=>openOrder(p)}
                    style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#1C1917",background:"transparent",border:"1px solid #E8E4DF",padding:"9px 18px",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}>
                    Order →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Custom = () => (
    <section style={{...S.sec,background:"#fff"}}>
      <div style={S.si}>
        <div style={S.sLbl}>Custom Order</div>
        <div style={S.sTitle}>Design your <em style={{fontStyle:"italic"}}>own piece</em></div>
        <div style={{maxWidth:660,background:"#F9F7F4",padding:48,border:"1px solid #E8E4DF"}}>
          {!user?(<>
            <p style={{fontSize:14,color:"#78716C",marginBottom:24}}>Sign in to place a custom order.</p>
            <button style={S.bigBtnDark} onClick={()=>{setModal("login");setLtab("login");setLerr("");}}>Sign In to Order</button>
          </>):(<>
            <div style={{background:"#FEF3F3",border:"1px solid #FECACA",padding:"12px 16px",marginBottom:24,fontSize:12,color:"#C0392B",fontWeight:600}}>
              🎉 20% OFF applied automatically at checkout
            </div>
            <div style={S.fg}><label style={S.lbl}>Item Name / Description</label>
              <input style={S.inp} value={cf.item} onChange={e=>setCf(f=>({...f,item:e.target.value}))} placeholder="e.g. Geometric coaster set"/></div>
            <div style={S.frow}>
              <div style={S.fg}><label style={S.lbl}>Length (inches)</label>
                <input style={S.inp} type="number" min=".1" max="5" step=".1" value={cf.len} onChange={e=>setCf(f=>({...f,len:e.target.value}))} placeholder="0.1–5.0"/>
                <span style={{fontSize:11,color:"#78716C"}}>Max 5 inches</span></div>
              <div style={S.fg}><label style={S.lbl}>Breadth (inches)</label>
                <input style={S.inp} type="number" min=".1" max="5" step=".1" value={cf.brd} onChange={e=>setCf(f=>({...f,brd:e.target.value}))} placeholder="0.1–5.0"/>
                <span style={{fontSize:11,color:"#78716C"}}>Max 5 inches</span></div>
            </div>
            <div style={S.frow}>
              <div style={S.fg}><label style={S.lbl}>Material</label>
                <select style={S.inp} value={cf.mat} onChange={e=>setCf(f=>({...f,mat:e.target.value}))}>{MATS.map(m=><option key={m}>{m}</option>)}</select></div>
              <div style={S.fg}><label style={S.lbl}>Colour</label>
                <select style={S.inp} value={cf.col} onChange={e=>setCf(f=>({...f,col:e.target.value}))}>{COLS.map(c=><option key={c}>{c}</option>)}</select></div>
            </div>
            <div style={S.fg}><label style={S.lbl}>Surface Finish</label>
              <select style={S.inp} value={cf.fin} onChange={e=>setCf(f=>({...f,fin:e.target.value}))}>{FINS.map(f=><option key={f}>{f}</option>)}</select></div>
            <div style={S.fg}><label style={S.lbl}>Additional Notes</label>
              <textarea style={{...S.inp,resize:"vertical",minHeight:90}} value={cf.notes} onChange={e=>setCf(f=>({...f,notes:e.target.value}))} placeholder="Any special details or requirements..."/></div>
            <button style={S.subBtn} onClick={doOrder}>Place Custom Order →</button>
          </>)}
        </div>
      </div>
    </section>
  );

  const Orders = () => {
    const mine=user?(isAdmin?orders:orders.filter(o=>o.user===user.u)):[];
    const sc=s=>s==="Completed"?{background:"#DCFCE7",color:"#14532D"}:s==="Processing"?{background:"#DBEAFE",color:"#1E3A8A"}:{background:"#FEF9C3",color:"#713F12"};
    return (
      <section style={{...S.sec,background:"#F9F7F4"}}>
        <div style={S.si}>
          <div style={S.sLbl}>{isAdmin?"All Orders":"My Orders"}</div>
          <div style={S.sTitle}>Order <em style={{fontStyle:"italic"}}>History</em></div>
          {!user?(
            <div style={{display:"flex",alignItems:"center",gap:14,background:"#fff",border:"1px solid #E8E4DF",padding:"20px 24px"}}>
              <span style={{fontSize:24}}>🔒</span>
              <p style={{fontSize:13}}>Sign in to view your orders.
                <button style={{...S.btnDark,marginLeft:14}} onClick={()=>{setModal("login");setLtab("login");setLerr("");}}>Sign In</button></p>
            </div>
          ):mine.length===0?(
            <div style={{textAlign:"center",padding:"60px 24px",color:"#78716C",background:"#fff",border:"1px solid #E8E4DF"}}>
              <div style={{fontSize:40,marginBottom:14}}>📦</div>
              <p style={{marginBottom:20}}>No orders yet.</p>
              <button style={S.bigBtnDark} onClick={()=>go("custom")}>Place Your First Order</button>
            </div>
          ):(
            <div style={{overflowX:"auto",background:"#fff",border:"1px solid #E8E4DF"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Order ID","Item","Specs","Size","Price","Date","Status"].map(h=>(
                  <th key={h} style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#78716C",padding:"14px 18px",textAlign:"left",borderBottom:"1px solid #E8E4DF"}}>{h}</th>
                ))}</tr></thead>
                <tbody>{mine.map(o=>(
                  <tr key={o.id}>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF",fontWeight:600,color:"#B5906B"}}>{o.id}</td>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF"}}>{o.item}</td>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF",color:"#78716C"}}>{o.col} · {o.mat.split(" ")[0]}</td>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF"}}>{o.l}″×{o.b}″</td>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF",fontWeight:600,color:"#C0392B"}}>₹{o.price}</td>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF",color:"#78716C"}}>{o.date}</td>
                    <td style={{padding:"16px 18px",borderBottom:"1px solid #E8E4DF"}}>
                      <span style={{...sc(o.status),fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"3px 10px",display:"inline-block"}}>{o.status}</span>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    );
  };

  const Contact = () => (
    <section style={{...S.sec,background:"#fff"}}>
      <div style={S.si}>
        <div style={S.sLbl}>Get in Touch</div>
        <div style={S.sTitle}>We'd love to <em style={{fontStyle:"italic"}}>hear from you</em></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64}}>
          <div>
            {[
              {icon:"✉", lbl:"Email",    val:"entrepreneurask369@gmail.com", href:"mailto:entrepreneurask369@gmail.com"},
              {icon:"📸",lbl:"Instagram",val:"@sanjeevkarthikeya.official",   href:"https://instagram.com/sanjeevkarthikeya.official"},
              {icon:"👤",lbl:"Founder",  val:"Sanjeev Karthikeya.A",          href:null},
              {icon:"📐",lbl:"Max Print",val:"5 × 5 inches per piece",        href:null},
            ].map(c=>(
              <div key={c.lbl} style={S.citem}>
                <div style={S.cicon}>{c.icon}</div>
                <div>
                  <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#78716C",marginBottom:4}}>{c.lbl}</div>
                  {c.href
                    ?<a href={c.href} target={c.href.startsWith("http")?"_blank":undefined} style={{fontSize:14,color:"#1C1917",textDecoration:"none"}}>{c.val}</a>
                    :<span style={{fontSize:14,color:"#1C1917"}}>{c.val}</span>}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontStyle:"italic",lineHeight:1.35,maxWidth:340}}>"Every object begins with your imagination."</div>
            <p style={{marginTop:22,fontSize:13,color:"#78716C",lineHeight:1.9}}>Reach out via email or DM us on Instagram. We respond within 24 hours.</p>
            <div style={{marginTop:30,padding:"18px 22px",background:"#F5EDE3",borderLeft:"3px solid #B5906B"}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#B5906B",marginBottom:6}}>Founded by</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>Sanjeev Karthikeya.A</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const XBtn = () => <button style={{position:"absolute",top:18,right:18,fontSize:17,background:"none",border:"none",color:"#78716C"}} onClick={closeModal}>✕</button>;

  const LoginModal = () => (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&closeModal()}>
      <div style={S.mBox}>
        <XBtn/>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:400,marginBottom:6}}>Craft<span style={{color:"#B5906B"}}>ix</span></h2>
        <p style={{fontSize:13,color:"#78716C",marginBottom:24}}>Sign in or create an account to order.</p>
        <div style={{display:"flex",marginBottom:24,borderBottom:"1px solid #E8E4DF"}}>
          <button style={S.tab(ltab==="login")}  onClick={()=>{setLtab("login");setLerr("");}}>Sign In</button>
          <button style={S.tab(ltab==="signup")} onClick={()=>{setLtab("signup");setLerr("");}}>Create Account</button>
        </div>
        {ltab==="login"?<>
          <div style={S.fg}><label style={S.lbl}>Username</label><input style={S.inp} value={lf.u} onChange={e=>setLf(f=>({...f,u:e.target.value}))} placeholder="your username"/></div>
          <div style={S.fg}><label style={S.lbl}>Password</label><input style={S.inp} type="password" value={lf.p} onChange={e=>setLf(f=>({...f,p:e.target.value}))} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
          {lerr&&<span style={{fontSize:12,color:"#C0392B",marginBottom:8,display:"block"}}>{lerr}</span>}
          <button style={S.subBtn} onClick={doLogin}>Sign In →</button>
        </>:<>
          <div style={S.fg}><label style={S.lbl}>Username</label><input style={S.inp} value={sf.u} onChange={e=>setSf(f=>({...f,u:e.target.value}))} placeholder="choose a username"/></div>
          <div style={S.fg}><label style={S.lbl}>Email</label><input style={S.inp} type="email" value={sf.e} onChange={e=>setSf(f=>({...f,e:e.target.value}))} placeholder="your@email.com"/></div>
          <div style={S.fg}><label style={S.lbl}>Password</label><input style={S.inp} type="password" value={sf.p} onChange={e=>setSf(f=>({...f,p:e.target.value}))} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&doSignup()}/></div>
          {lerr&&<span style={{fontSize:12,color:"#C0392B",marginBottom:8,display:"block"}}>{lerr}</span>}
          <button style={S.subBtn} onClick={doSignup}>Create Account →</button>
        </>}
      </div>
    </div>
  );

  const OrderModal = () => (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&closeModal()}>
      <div style={S.mBoxW}>
        <XBtn/>
        {oprod&&<Img p={oprod} style={{width:"100%",height:160,objectFit:"cover",marginBottom:24}}/>}
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:400,marginBottom:6}}>{oprod?.name||"Custom Order"}</h2>
        {oprod&&<div style={{marginBottom:18}}><PriceBlock price={oprod.price} big/></div>}
        <div style={S.frow}>
          <div style={S.fg}><label style={S.lbl}>Length (in)</label><input style={S.inp} type="number" min=".1" max="5" step=".1" value={cf.len} onChange={e=>setCf(f=>({...f,len:e.target.value}))} placeholder="0.1–5.0"/></div>
          <div style={S.fg}><label style={S.lbl}>Breadth (in)</label><input style={S.inp} type="number" min=".1" max="5" step=".1" value={cf.brd} onChange={e=>setCf(f=>({...f,brd:e.target.value}))} placeholder="0.1–5.0"/></div>
        </div>
        <div style={S.frow}>
          <div style={S.fg}><label style={S.lbl}>Material</label><select style={S.inp} value={cf.mat} onChange={e=>setCf(f=>({...f,mat:e.target.value}))}>{MATS.map(m=><option key={m}>{m}</option>)}</select></div>
          <div style={S.fg}><label style={S.lbl}>Colour</label><select style={S.inp} value={cf.col} onChange={e=>setCf(f=>({...f,col:e.target.value}))}>{COLS.map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div style={S.fg}><label style={S.lbl}>Surface Finish</label><select style={S.inp} value={cf.fin} onChange={e=>setCf(f=>({...f,fin:e.target.value}))}>{FINS.map(f=><option key={f}>{f}</option>)}</select></div>
        <div style={S.fg}><label style={S.lbl}>Notes</label><textarea style={{...S.inp,resize:"vertical",minHeight:76}} value={cf.notes} onChange={e=>setCf(f=>({...f,notes:e.target.value}))} placeholder="Special requirements..."/></div>
        <button style={S.subBtn} onClick={doOrder}>Confirm Order →</button>
      </div>
    </div>
  );

  const AdminModal = () => (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&closeModal()}>
      <div style={S.mBoxW}>
        <XBtn/>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:400,marginBottom:6}}>Edit Prices</h2>
        <p style={{fontSize:13,color:"#78716C",marginBottom:24}}>Admin only — update catalogue pricing.</p>
        {prods.map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,padding:"12px 16px",background:"#F9F7F4",border:"1px solid #E8E4DF",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Img p={p} style={{width:52,height:40,objectFit:"cover"}}/>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
                <div style={{fontSize:11,color:"#78716C"}}>Sale: ₹{salePrice(p.price)}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:"#78716C"}}>Base ₹</span>
              <input style={{...S.inp,width:90,padding:"8px 12px"}} type="number" min="1" value={ap[p.id]||p.price} onChange={e=>setAp(a=>({...a,[p.id]:e.target.value}))}/>
            </div>
          </div>
        ))}
        <button style={{...S.subBtn,marginTop:16}} onClick={saveAdmin}>Save All Prices →</button>
      </div>
    </div>
  );

  const pages={home:<><Hero/><Products/><Contact/></>,products:<Products/>,custom:<Custom/>,orders:<Orders/>,contact:<Contact/>};

  return (
    <div style={{minHeight:"100vh",background:"#F9F7F4"}}>
      <Nav/>
      <main style={S.main}>{pages[page]||pages.home}</main>
      <footer style={S.footer}>
        <div style={{marginBottom:6}}>
          <strong style={{color:"rgba(255,255,255,.9)",fontFamily:"'Playfair Display',serif",fontSize:16}}>
            Craft<span style={{color:"#B5906B"}}>ix</span>
          </strong>
        </div>
        <div>Founded by <strong style={{color:"rgba(255,255,255,.75)"}}>Sanjeev Karthikeya.A</strong></div>
        <div style={{marginTop:4}}>3D Printing Studio · Max 5 × 5 inches · entrepreneurask369@gmail.com</div>
      </footer>
      {modal==="login"&&<LoginModal/>}
      {modal==="order"&&<OrderModal/>}
      {modal==="admin"&&<AdminModal/>}
      {toast&&<div style={S.toast}>{toast}</div>}
    </div>
  );
}