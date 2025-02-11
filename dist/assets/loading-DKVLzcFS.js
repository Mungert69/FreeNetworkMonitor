import{b6 as r,R as e,b7 as a,b8 as t,b9 as o,H as n,F as i,r as s,I as l,b as c,_ as u,j as d,w as f,D as b,J as m,al as p,aj as g,q as v,x as h,l as y,aA as S}from"./index-DeeNhdUq.js";const w={area:r,delay:0},C=(n=w)=>{let i=e.useRef(!1);e.useEffect((()=>(i.current=!0,()=>i.current=!1)),[]);const[s]=e.useState((e=>({area:e&&e.area?e.area:r,delay:e&&e.delay?e.delay:0}))(n));e.useEffect((()=>{i.current&&s&&s.area&&a(s.area)>0&&(c(!0),d(!0))}),[s]);const[l,c]=e.useState(!1),[u,d]=e.useState(!1),f=e.useRef(l),b=(r,e)=>{i.current&&s.area===e&&(c(r),f.current=r,r?s&&s.delay&&0!==s.delay?setTimeout((()=>{i.current&&f.current&&d(!0)}),s.delay):d(!0):d(!1))};return e.useEffect((()=>(f.current=l,t.on(o,b),()=>t.off(o,b))),[]),{promiseInProgress:u}};function x(r){return n("MuiCardActions",r)}i("MuiCardActions",["root","spacing"]);const $=["disableSpacing","className"],k=f("div",{name:"MuiCardActions",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.root,!a.disableSpacing&&e.spacing]}})((({ownerState:r})=>u({display:"flex",alignItems:"center",padding:8},!r.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}}))),P=s.forwardRef((function(r,e){const a=l({props:r,name:"MuiCardActions"}),{disableSpacing:t=!1,className:o}=a,n=c(a,$),i=u({},a,{disableSpacing:t}),s=(r=>{const{classes:e,disableSpacing:a}=r;return m({root:["root",!a&&"spacing"]},x,e)})(i);return d.jsx(k,u({className:b(s.root,o),ownerState:i,ref:e},n))}));function I(r){return n("MuiLinearProgress",r)}i("MuiLinearProgress",["root","colorPrimary","colorSecondary","determinate","indeterminate","buffer","query","dashed","dashedColorPrimary","dashedColorSecondary","bar","barColorPrimary","barColorSecondary","bar1Indeterminate","bar1Determinate","bar1Buffer","bar2Indeterminate","bar2Buffer"]);const M=["className","color","value","valueBuffer","variant"];let R,j,B,L,q,N,A=r=>r;const z=h(R||(R=A`
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
`)),D=h(j||(j=A`
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
`)),E=h(B||(B=A`
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
`)),O=(r,e)=>"inherit"===e?"currentColor":r.vars?r.vars.palette.LinearProgress[`${e}Bg`]:"light"===r.palette.mode?y.lighten(r.palette[e].main,.62):y.darken(r.palette[e].main,.5),T=f("span",{name:"MuiLinearProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.root,e[`color${g(a.color)}`],e[a.variant]]}})((({ownerState:r,theme:e})=>u({position:"relative",overflow:"hidden",display:"block",height:4,zIndex:0,"@media print":{colorAdjust:"exact"},backgroundColor:O(e,r.color)},"inherit"===r.color&&"buffer"!==r.variant&&{backgroundColor:"none","&::before":{content:'""',position:"absolute",left:0,top:0,right:0,bottom:0,backgroundColor:"currentColor",opacity:.3}},"buffer"===r.variant&&{backgroundColor:"transparent"},"query"===r.variant&&{transform:"rotate(180deg)"}))),X=f("span",{name:"MuiLinearProgress",slot:"Dashed",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.dashed,e[`dashedColor${g(a.color)}`]]}})((({ownerState:r,theme:e})=>{const a=O(e,r.color);return u({position:"absolute",marginTop:0,height:"100%",width:"100%"},"inherit"===r.color&&{opacity:.3},{backgroundImage:`radial-gradient(${a} 0%, ${a} 16%, transparent 42%)`,backgroundSize:"10px 10px",backgroundPosition:"0 -23px"})}),v(L||(L=A`
    animation: ${0} 3s infinite linear;
  `),E)),F=f("span",{name:"MuiLinearProgress",slot:"Bar1",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.bar,e[`barColor${g(a.color)}`],("indeterminate"===a.variant||"query"===a.variant)&&e.bar1Indeterminate,"determinate"===a.variant&&e.bar1Determinate,"buffer"===a.variant&&e.bar1Buffer]}})((({ownerState:r,theme:e})=>u({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",backgroundColor:"inherit"===r.color?"currentColor":(e.vars||e).palette[r.color].main},"determinate"===r.variant&&{transition:"transform .4s linear"},"buffer"===r.variant&&{zIndex:1,transition:"transform .4s linear"})),(({ownerState:r})=>("indeterminate"===r.variant||"query"===r.variant)&&v(q||(q=A`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `),z))),H=f("span",{name:"MuiLinearProgress",slot:"Bar2",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.bar,e[`barColor${g(a.color)}`],("indeterminate"===a.variant||"query"===a.variant)&&e.bar2Indeterminate,"buffer"===a.variant&&e.bar2Buffer]}})((({ownerState:r,theme:e})=>u({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left"},"buffer"!==r.variant&&{backgroundColor:"inherit"===r.color?"currentColor":(e.vars||e).palette[r.color].main},"inherit"===r.color&&{opacity:.3},"buffer"===r.variant&&{backgroundColor:O(e,r.color),transition:"transform .4s linear"})),(({ownerState:r})=>("indeterminate"===r.variant||"query"===r.variant)&&v(N||(N=A`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `),D))),J=s.forwardRef((function(r,e){const a=l({props:r,name:"MuiLinearProgress"}),{className:t,color:o="primary",value:n,valueBuffer:i,variant:s="indeterminate"}=a,f=c(a,M),v=u({},a,{color:o,variant:s}),h=(r=>{const{classes:e,variant:a,color:t}=r,o={root:["root",`color${g(t)}`,a],dashed:["dashed",`dashedColor${g(t)}`],bar1:["bar",`barColor${g(t)}`,("indeterminate"===a||"query"===a)&&"bar1Indeterminate","determinate"===a&&"bar1Determinate","buffer"===a&&"bar1Buffer"],bar2:["bar","buffer"!==a&&`barColor${g(t)}`,"buffer"===a&&`color${g(t)}`,("indeterminate"===a||"query"===a)&&"bar2Indeterminate","buffer"===a&&"bar2Buffer"]};return m(o,I,e)})(v),y=p(),S={},w={bar1:{},bar2:{}};if(("determinate"===s||"buffer"===s)&&void 0!==n){S["aria-valuenow"]=Math.round(n),S["aria-valuemin"]=0,S["aria-valuemax"]=100;let r=n-100;y&&(r=-r),w.bar1.transform=`translateX(${r}%)`}if("buffer"===s&&void 0!==i){let r=(i||0)-100;y&&(r=-r),w.bar2.transform=`translateX(${r}%)`}return d.jsxs(T,u({className:b(h.root,t),ownerState:v,role:"progressbar"},S,{ref:e},f,{children:["buffer"===s?d.jsx(X,{className:h.dashed,ownerState:v}):null,d.jsx(F,{className:h.bar1,ownerState:v,style:w.bar1}),"determinate"===s?null:d.jsx(H,{className:h.bar2,ownerState:v,style:w.bar2})]}))})),_=e.memo((()=>{const{promiseInProgress:r}=C();return!0===r?d.jsx(S,{sx:{width:"100%"},children:d.jsx(J,{color:"secondary"})}):null}));export{P as C,_ as L};
