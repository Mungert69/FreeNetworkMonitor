import{aW as r,N as e,aX as a,aY as t,aZ as o,$ as n,Z as i,r as s,a0 as l,V as c,v as u,O as p,a1 as d,aa as f,Q as b,U as m,a8 as g,F as y,o as v,n as h,D as C,aq as S}from"./index-CU91BwQO.js";const w={area:r,delay:0},x=(n=w)=>{let i=e.useRef(!1);e.useEffect((()=>(i.current=!0,()=>i.current=!1)),[]);const[s]=e.useState((e=>({area:e&&e.area?e.area:r,delay:e&&e.delay?e.delay:0}))(n));e.useEffect((()=>{i.current&&s&&s.area&&a(s.area)>0&&(c(!0),p(!0))}),[s]);const[l,c]=e.useState(!1),[u,p]=e.useState(!1),d=e.useRef(l),f=(r,e)=>{i.current&&s.area===e&&(c(r),d.current=r,r?s&&s.delay&&0!==s.delay?setTimeout((()=>{i.current&&d.current&&p(!0)}),s.delay):p(!0):p(!1))};return e.useEffect((()=>(d.current=l,t.on(o,f),()=>t.off(o,f))),[]),{promiseInProgress:u}};function $(r){return n("MuiCardActions",r)}i("MuiCardActions",["root","spacing"]);const k=u("div",{name:"MuiCardActions",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.root,!a.disableSpacing&&e.spacing]}})({display:"flex",alignItems:"center",padding:8,variants:[{props:{disableSpacing:!1},style:{"& > :not(style) ~ :not(style)":{marginLeft:8}}}]}),P=s.forwardRef((function(r,e){const a=l({props:r,name:"MuiCardActions"}),{disableSpacing:t=!1,className:o,...n}=a,i={...a,disableSpacing:t},s=(r=>{const{classes:e,disableSpacing:a}=r;return d({root:["root",!a&&"spacing"]},$,e)})(i);return c.jsx(k,{className:p(s.root,o),ownerState:i,ref:e,...n})}));function j(r){return n("MuiLinearProgress",r)}i("MuiLinearProgress",["root","colorPrimary","colorSecondary","determinate","indeterminate","buffer","query","dashed","dashedColorPrimary","dashedColorSecondary","bar","bar1","bar2","barColorPrimary","barColorSecondary","bar1Indeterminate","bar1Determinate","bar1Buffer","bar2Indeterminate","bar2Buffer"]);const I=C`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`,B="string"!=typeof I?h`
        animation: ${I} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
      `:null,L=C`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`,M="string"!=typeof L?h`
        animation: ${L} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
      `:null,q=C`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`,R="string"!=typeof q?h`
        animation: ${q} 3s infinite linear;
      `:null,N=(r,e)=>r.vars?r.vars.palette.LinearProgress[`${e}Bg`]:"light"===r.palette.mode?y(r.palette[e].main,.62):v(r.palette[e].main,.5),O=u("span",{name:"MuiLinearProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.root,e[`color${b(a.color)}`],e[a.variant]]}})(m((({theme:r})=>({position:"relative",overflow:"hidden",display:"block",height:4,zIndex:0,"@media print":{colorAdjust:"exact"},variants:[...Object.entries(r.palette).filter(g()).map((([e])=>({props:{color:e},style:{backgroundColor:N(r,e)}}))),{props:({ownerState:r})=>"inherit"===r.color&&"buffer"!==r.variant,style:{"&::before":{content:'""',position:"absolute",left:0,top:0,right:0,bottom:0,backgroundColor:"currentColor",opacity:.3}}},{props:{variant:"buffer"},style:{backgroundColor:"transparent"}},{props:{variant:"query"},style:{transform:"rotate(180deg)"}}]})))),z=u("span",{name:"MuiLinearProgress",slot:"Dashed",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.dashed,e[`dashedColor${b(a.color)}`]]}})(m((({theme:r})=>({position:"absolute",marginTop:0,height:"100%",width:"100%",backgroundSize:"10px 10px",backgroundPosition:"0 -23px",variants:[{props:{color:"inherit"},style:{opacity:.3,backgroundImage:"radial-gradient(currentColor 0%, currentColor 16%, transparent 42%)"}},...Object.entries(r.palette).filter(g()).map((([e])=>{const a=N(r,e);return{props:{color:e},style:{backgroundImage:`radial-gradient(${a} 0%, ${a} 16%, transparent 42%)`}}}))]}))),R||{animation:`${q} 3s infinite linear`}),A=u("span",{name:"MuiLinearProgress",slot:"Bar1",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.bar,e.bar1,e[`barColor${b(a.color)}`],("indeterminate"===a.variant||"query"===a.variant)&&e.bar1Indeterminate,"determinate"===a.variant&&e.bar1Determinate,"buffer"===a.variant&&e.bar1Buffer]}})(m((({theme:r})=>({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",variants:[{props:{color:"inherit"},style:{backgroundColor:"currentColor"}},...Object.entries(r.palette).filter(g()).map((([e])=>({props:{color:e},style:{backgroundColor:(r.vars||r).palette[e].main}}))),{props:{variant:"determinate"},style:{transition:"transform .4s linear"}},{props:{variant:"buffer"},style:{zIndex:1,transition:"transform .4s linear"}},{props:({ownerState:r})=>"indeterminate"===r.variant||"query"===r.variant,style:{width:"auto"}},{props:({ownerState:r})=>"indeterminate"===r.variant||"query"===r.variant,style:B||{animation:`${I} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`}}]})))),D=u("span",{name:"MuiLinearProgress",slot:"Bar2",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.bar,e.bar2,e[`barColor${b(a.color)}`],("indeterminate"===a.variant||"query"===a.variant)&&e.bar2Indeterminate,"buffer"===a.variant&&e.bar2Buffer]}})(m((({theme:r})=>({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",variants:[...Object.entries(r.palette).filter(g()).map((([e])=>({props:{color:e},style:{"--LinearProgressBar2-barColor":(r.vars||r).palette[e].main}}))),{props:({ownerState:r})=>"buffer"!==r.variant&&"inherit"!==r.color,style:{backgroundColor:"var(--LinearProgressBar2-barColor, currentColor)"}},{props:({ownerState:r})=>"buffer"!==r.variant&&"inherit"===r.color,style:{backgroundColor:"currentColor"}},{props:{color:"inherit"},style:{opacity:.3}},...Object.entries(r.palette).filter(g()).map((([e])=>({props:{color:e,variant:"buffer"},style:{backgroundColor:N(r,e),transition:"transform .4s linear"}}))),{props:({ownerState:r})=>"indeterminate"===r.variant||"query"===r.variant,style:{width:"auto"}},{props:({ownerState:r})=>"indeterminate"===r.variant||"query"===r.variant,style:M||{animation:`${L} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite`}}]})))),E=s.forwardRef((function(r,e){const a=l({props:r,name:"MuiLinearProgress"}),{className:t,color:o="primary",value:n,valueBuffer:i,variant:s="indeterminate",...u}=a,m={...a,color:o,variant:s},g=(r=>{const{classes:e,variant:a,color:t}=r,o={root:["root",`color${b(t)}`,a],dashed:["dashed",`dashedColor${b(t)}`],bar1:["bar","bar1",`barColor${b(t)}`,("indeterminate"===a||"query"===a)&&"bar1Indeterminate","determinate"===a&&"bar1Determinate","buffer"===a&&"bar1Buffer"],bar2:["bar","bar2","buffer"!==a&&`barColor${b(t)}`,"buffer"===a&&`color${b(t)}`,("indeterminate"===a||"query"===a)&&"bar2Indeterminate","buffer"===a&&"bar2Buffer"]};return d(o,j,e)})(m),y=f(),v={},h={bar1:{},bar2:{}};if(("determinate"===s||"buffer"===s)&&void 0!==n){v["aria-valuenow"]=Math.round(n),v["aria-valuemin"]=0,v["aria-valuemax"]=100;let r=n-100;y&&(r=-r),h.bar1.transform=`translateX(${r}%)`}if("buffer"===s&&void 0!==i){let r=(i||0)-100;y&&(r=-r),h.bar2.transform=`translateX(${r}%)`}return c.jsxs(O,{className:p(g.root,t),ownerState:m,role:"progressbar",...v,ref:e,...u,children:["buffer"===s?c.jsx(z,{className:g.dashed,ownerState:m}):null,c.jsx(A,{className:g.bar1,ownerState:m,style:h.bar1}),"determinate"===s?null:c.jsx(D,{className:g.bar2,ownerState:m,style:h.bar2})]})})),X=e.memo((()=>{const{promiseInProgress:r}=x();return!0===r?c.jsx(S,{sx:{width:"100%"},children:c.jsx(E,{color:"secondary"})}):null}));export{P as C,X as L};
