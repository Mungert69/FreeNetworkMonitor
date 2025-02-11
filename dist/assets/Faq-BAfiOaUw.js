import{r as V,R as p,aR as Z,aS as ct,j as r,aO as dt,D as S,aT as pt}from"./index-DzjaIDDW.js";import{P as _,c as ut,w as ht,Z as gt,$ as ft,a0 as wt,h as mt,I as E,a1 as yt,a2 as _t,j as T,a3 as vt,a4 as bt,X as R,O as kt,a5 as xt,a6 as At,G as w}from"./Helmet-CfyFocR3.js";import{F as It}from"./Footer-BydBm_lp.js";import{T as Tt}from"./TextField-bS_H4cWT.js";function K(o,t){if(!(o instanceof t))throw new TypeError("Cannot call a class as a function")}function Pt(o,t){for(var n=0;n<t.length;n++){var e=t[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(o,e.key,e)}}function $(o,t,n){return t&&Pt(o.prototype,t),o}function y(o,t,n){return t in o?Object.defineProperty(o,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):o[t]=n,o}function D(){return(D=Object.assign||function(o){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(o[e]=n[e])}return o}).apply(this,arguments)}function W(o,t){var n=Object.keys(o);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(o);t&&(e=e.filter(function(a){return Object.getOwnPropertyDescriptor(o,a).enumerable})),n.push.apply(n,e)}return n}function X(o,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");o.prototype=Object.create(t&&t.prototype,{constructor:{value:o,writable:!0,configurable:!0}}),t&&J(o,t)}function U(o){return(U=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(o)}function J(o,t){return(J=Object.setPrototypeOf||function(n,e){return n.__proto__=e,n})(o,t)}function v(o){if(o===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return o}function jt(o,t){return!t||typeof t!="object"&&typeof t!="function"?v(o):t}function tt(o){var t=function(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}();return function(){var n,e=U(o);if(t){var a=U(this).constructor;n=Reflect.construct(e,arguments,a)}else n=e.apply(this,arguments);return jt(this,n)}}var N={return:13,arrowLeft:37,arrowUp:38,arrowRight:39,arrowDown:40,space:32};N.keyCodes=Object.keys(N).reduce(function(o,t){return o[N[t]]=t,o},{});var f={"faq-row-wrapper":"styles_faq-row-wrapper__3vA1D","faq-row":"styles_faq-row__2YF3c","row-body":"styles_row-body__1NvUo","row-title":"styles_row-title__1YiiY","no-tabfocus":"styles_no-tabfocus__1HmyD","row-title-text":"styles_row-title-text__1MuhU","icon-wrapper":"styles_icon-wrapper__2cftw",closed:"styles_closed__39w54","row-content":"styles_row-content__QOGZd",animate:"styles_animate__3ecdr",static:"styles_static__3chYW",expanded:"styles_expanded__3elPy",expanding:"styles_expanding__2OAFB","row-content-text":"styles_row-content-text__2sgAB"};(function(o,t){t===void 0&&(t={});var n=t.insertAt;if(typeof document<"u"){var e=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",n==="top"&&e.firstChild?e.insertBefore(a,e.firstChild):e.appendChild(a),a.styleSheet?a.styleSheet.cssText=o:a.appendChild(document.createTextNode(o))}})(`.styles_faq-row-wrapper__3vA1D {
  background-color: var(--faq-bg-color, white); }
  .styles_faq-row-wrapper__3vA1D h2 {
    margin: 0;
    color: var(--title-text-color, black);
    font-size: var(--title-text-size, 30px); }
  .styles_faq-row-wrapper__3vA1D .styles_faq-row__2YF3c {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #ccc; }
  .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c {
    flex-direction: column;
    position: relative; }
    .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      color: var(--row-title-color, black);
      font-size: var(--row-title-text-size, large);
      cursor: pointer;
      align-items: center; }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_no-tabfocus__1HmyD {
        outline: none; }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY .styles_row-title-text__1MuhU {
        padding-right: 3em; }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY .styles_icon-wrapper__2cftw {
        max-width: 25px;
        max-height: 25px;
        margin: 0;
        padding: 0;
        color: var(--arrow-color, black);
        transform: rotate(0deg);
        transition: transform var(--transition-duration, 0.3s);
        position: absolute;
        top: 13px;
        right: 12px; }
        .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY .styles_icon-wrapper__2cftw svg {
          width: 100%;
          height: 100%; }
        .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY .styles_icon-wrapper__2cftw svg {
          fill: var(--arrow-color, black); }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_closed__39w54 + .styles_row-content__QOGZd {
        visibility: hidden; }
        .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_closed__39w54 + .styles_row-content__QOGZd.styles_animate__3ecdr {
          opacity: 0;
          transition: height var(--transition-duration, 0.3s); }
        .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_closed__39w54 + .styles_row-content__QOGZd.styles_static__3chYW {
          display: none; }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_expanded__3elPy + .styles_row-content__QOGZd {
        visibility: visible; }
        .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_expanded__3elPy + .styles_row-content__QOGZd.styles_static__3chYW {
          display: block; }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_expanded__3elPy .styles_icon-wrapper__2cftw {
        transform: rotate(180deg); }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-title__1YiiY.styles_expanding__2OAFB .styles_icon-wrapper__2cftw {
        transform: rotate(180deg); }
    .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-content__QOGZd {
      overflow: hidden;
      transition: height var(--transition-duration, 0.3s);
      transition-timing-function: var(--timing-function, ease); }
      .styles_faq-row-wrapper__3vA1D .styles_row-body__1NvUo .styles_faq-row__2YF3c .styles_row-content__QOGZd .styles_row-content-text__2sgAB {
        color: var(--row-content-color, black);
        font-size: var(--row-content-text-size, medium);
        padding: var(--row-content-padding-top, 0) var(--row-content-padding-right, 0) var(--row-content-padding-bottom, 0) var(--row-content-padding-left, 0); }
`);var et=function(o){X(n,V.PureComponent);var t=tt(n);function n(){var e;K(this,n);for(var a=arguments.length,c=new Array(a),i=0;i<a;i++)c[i]=arguments[i];return y(v(e=t.call.apply(t,[this].concat(c))),"state",{isExpanded:!1,ref:p.createRef(),rowRef:p.createRef(),height:0,rowClassName:"closed"}),y(v(e),"finishTransition",function(){var s=e.state.isExpanded;e.setState({rowClassName:s?"expanded":"closed"})}),y(v(e),"toggle",function(s){e.setState(function(){return{isExpanded:s}})}),y(v(e),"expand",function(){e.setState(function(s){return{isExpanded:!s.isExpanded}})}),y(v(e),"keyPress",function(s){var d=s.keyCode?s.keyCode:s.which;switch(N.keyCodes[d]){case"space":case"return":s.preventDefault(),s.stopPropagation(),e.expand()}}),y(v(e),"setHeight",function(){var s=e.state,d=s.ref,u=s.isExpanded,l=d.current.scrollHeight;e.setState({height:u?l:0})}),e}return $(n,[{key:"getSnapshotBeforeUpdate",value:function(e,a){var c=a.isExpanded,i=this.state.isExpanded,s=this.props.config,d=(s=s===void 0?{}:s).animate,u=d===void 0||d;return i!==c?{rowClassName:i?u?"expanding":"expanded":u?"closing":"closed"}:null}},{key:"componentDidUpdate",value:function(e,a,c){var i=this.props.config,s=(i=i===void 0?{}:i).animate,d=s===void 0||s;c!==null&&this.setState(function(u){for(var l=1;l<arguments.length;l++){var g=arguments[l]!=null?arguments[l]:{};l%2?W(Object(g),!0).forEach(function(m){y(u,m,g[m])}):Object.getOwnPropertyDescriptors?Object.defineProperties(u,Object.getOwnPropertyDescriptors(g)):W(Object(g)).forEach(function(m){Object.defineProperty(u,m,Object.getOwnPropertyDescriptor(g,m))})}return u}({},c),d?this.setHeight:void 0)}},{key:"componentDidMount",value:function(){var e=this,a=this.state.rowRef;if(this.props.openOnload&&this.expand(),this.props.getRowOptions){var c={expand:function(){e.toggle(!0)},close:function(){e.toggle(!1)},scrollIntoView:function(i){i?a.current.scrollIntoView(i):a.current.scrollIntoView()}};this.props.getRowOptions(c)}}},{key:"render",value:function(){var e=this.props,a=e.data,c=a.title,i=a.content,s=e.config,d=(s=s===void 0?{}:s).animate,u=d===void 0||d,l=s.arrowIcon,g=s.expandIcon,m=s.collapseIcon,b=s.tabFocus,k=b!==void 0&&b,h=this.state,x=h.isExpanded,C=h.ref,A=h.height,j=h.rowClassName,st=h.rowRef,Y={onClick:this.expand,role:"button","aria-expanded":x,"aria-controls":"react-faq-rowcontent-".concat(this.props.rowid),onKeyPress:this.keyPress,onKeyDown:this.keyPress};k&&(Y.tabIndex=0);var H={role:"region",id:"react-faq-rowcontent-".concat(this.props.rowid),"aria-expanded":x,"aria-hidden":!x,onTransitionEnd:this.finishTransition};u&&(H.style={height:A});var at=["row-title",j,f["row-title"],f[j],k?"":f["no-tabfocus"]].filter(Boolean).join(" "),F=null;F=g&&m?x?m:g:l||p.createElement("div",{dangerouslySetInnerHTML:{__html:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="36px" height="36px"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path d="M0 0h24v24H0V0z" fill="none"/></svg>'},className:"arrow-image ".concat(f["arrow-image"]),alt:"Expand arrow"});var it=[f["row-content"],"row-content",u?f.animate:f.static].join(" "),L=[f["row-content-text"],"row-content-text"].join(" "),lt=i&&typeof i=="string"?p.createElement("div",{className:L,dangerouslySetInnerHTML:{__html:i}}):p.createElement("div",{className:L},i);return p.createElement("section",{className:"faq-row ".concat(f["faq-row"]),role:"listitem",ref:st},p.createElement("div",D({className:at},Y),p.createElement("div",{className:"row-title-text ".concat(f["row-title-text"]),id:"react-faq-rowtitle-".concat(this.props.rowid)},c),p.createElement("span",{className:"icon-wrapper ".concat(f["icon-wrapper"]),"aria-hidden":"true"},F)),p.createElement("div",D({className:it},H,{ref:C}),lt))}}]),n}();y(et,"propTypes",{config:_.object,data:_.object,rowid:_.number,getRowOptions:_.func,openOnload:_.bool});var ot=function(o){X(n,V.PureComponent);var t=tt(n);function n(){var e;K(this,n);for(var a=arguments.length,c=new Array(a),i=0;i<a;i++)c[i]=arguments[i];return y(v(e=t.call.apply(t,[this].concat(c))),"state",{rowsOption:[]}),e}return $(n,[{key:"componentDidMount",value:function(){this.props.getRowOptions&&this.props.getRowOptions(this.state.rowsOption)}},{key:"render",value:function(){var e=this,a=this.props.data||{},c=a.title,i=a.rows,s=i===void 0?[]:i,d=this.props,u=d.styles,l=u===void 0?{}:u,g=d.config,m=((g=g===void 0?{}:g).animate,g.openOnload),b={"--faq-bg-color":l.bgColor,"--title-text-color":l.titleTextColor,"--title-text-size":l.titleTextSize,"--row-title-color":l.rowTitleColor,"--row-title-text-size":l.rowTitleTextSize,"--row-content-color":l.rowContentColor,"--row-content-text-size":l.rowContentTextSize,"--row-content-padding-top":l.rowContentPaddingTop,"--row-content-padding-bottom":l.rowContentPaddingBottom,"--row-content-padding-right":l.rowContentPaddingRight,"--row-content-padding-left":l.rowContentPaddingLeft,"--arrow-color":l.arrowColor,"--transition-duration":l.transitionDuration,"--timing-function":l.timingFunc},k="faq-row-wrapper ".concat(f["faq-row-wrapper"]),h="faq-title ".concat(f["faq-row"]),x="faq-body ".concat(f["row-body"]);return p.createElement("div",{className:k,style:b},c?p.createElement("section",{className:h},p.createElement("h2",null,c)):null,s.length?p.createElement("section",{className:x,role:"list"},s.map(function(C,A){return p.createElement(et,{openOnload:m===A,data:C,key:A,rowid:A+1,config:e.props.config,getRowOptions:function(j){return e.state.rowsOption[A]=j}})})):null)}}]),n}();y(ot,"propTypes",{data:_.object,styles:_.object,config:_.object,getRowOptions:_.func});/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var M=function(){return M=Object.assign||function(t){for(var n,e=1,a=arguments.length;e<a;e++){n=arguments[e];for(var c in n)Object.prototype.hasOwnProperty.call(n,c)&&(t[c]=n[c])}return t},M.apply(this,arguments)};function Nt(o,t){var n={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&t.indexOf(e)<0&&(n[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,e=Object.getOwnPropertySymbols(o);a<e.length;a++)t.indexOf(e[a])<0&&Object.prototype.propertyIsEnumerable.call(o,e[a])&&(n[e[a]]=o[e[a]]);return n}var I="",P=null,O=null,nt=null;function q(){I="",P!==null&&P.disconnect(),O!==null&&(window.clearTimeout(O),O=null)}function B(o){var t=["BUTTON","INPUT","SELECT","TEXTAREA"],n=["A","AREA"];return t.includes(o.tagName)&&!o.hasAttribute("disabled")||n.includes(o.tagName)&&o.hasAttribute("href")}function z(){var o=null;if(I==="#")o=document.body;else{var t=I.replace("#","");o=document.getElementById(t),o===null&&I==="#top"&&(o=document.body)}if(o!==null){nt(o);var n=o.getAttribute("tabindex");return n===null&&!B(o)&&o.setAttribute("tabindex",-1),o.focus({preventScroll:!0}),n===null&&!B(o)&&(o.blur(),o.removeAttribute("tabindex")),q(),!0}return!1}function Ot(o){window.setTimeout(function(){z()===!1&&(P===null&&(P=new MutationObserver(z)),P.observe(document,{attributes:!0,childList:!0,subtree:!0}),O=window.setTimeout(function(){q()},o||1e4))},0)}function rt(o){return p.forwardRef(function(t,n){var e="";typeof t.to=="string"&&t.to.includes("#")?e="#"+t.to.split("#").slice(1).join("#"):typeof t.to=="object"&&typeof t.to.hash=="string"&&(e=t.to.hash);var a={};o===Z&&(a.isActive=function(s,d){return s&&s.isExact&&d.hash===e});function c(s){q(),I=t.elementId?"#"+t.elementId:e,t.onClick&&t.onClick(s),I!==""&&!s.defaultPrevented&&s.button===0&&(!t.target||t.target==="_self")&&!(s.metaKey||s.altKey||s.ctrlKey||s.shiftKey)&&(nt=t.scroll||function(d){return t.smooth?d.scrollIntoView({behavior:"smooth"}):d.scrollIntoView()},Ot(t.timeout))}var i=Nt(t,["scroll","smooth","timeout","elementId"]);return p.createElement(o,M({},a,i,{onClick:c,ref:n}),t.children)})}var Q=rt(ct);rt(Z);const G={title:"FAQ (Find answers to common questions here)",rows:[{title:"How do I add websites and hosts to monitor?",content:`
                <p>You must first login to add hosts. Go to the 
                <a href="https://freenetworkmonitor.click/dashboard" target="_blank">dashboard page</a> and click "Login".</p>
                <p>If you don't already have an account, create one when prompted. After logging in, click the edit icon at the top left, next to the login icon. For a visual guide, refer to guide number 2 above.</p>
            `},{title:"How do I receive alerts?",content:`
                <p>Alerts are automatically sent to the email address associated with your login. As long as you are still subscribed to receive alerts, no additional action is required.</p>
            `},{title:"How do I add more hosts?",content:`
                <p>The number of hosts you can add is determined by your account type. To add more hosts and enjoy additional benefits, 
                <a href="https://freenetworkmonitor.click/subscription" target="_blank">upgrade your subscription</a>.</p>
            `},{title:"The time of events changes when I login in different locations?",content:`
                <p>The timezone of your browser is used to calculate the time of events. On the server, all times are stored as UTC. Therefore, the time of events may appear to change if you log in from different geographical locations. However, alerts will always be sent with UTC as the timestamp.</p>
            `},{title:"How do I get support or ask a question?",content:`
                <p>You can contact us for support or to ask a question by emailing 
                <strong>support@freenetworkmonitor.click</strong> or <strong>support@mahadeva.co.uk</strong>.</p>
            `},{title:"I am not receiving email notifications when the dashboard shows a new alert.",content:`
                <p>Check that you have email notifications enabled in your profile:</p>
                <ol>
                    <li>Click the profile icon in the top right of the 
                    <a href="https://freenetworkmonitor.click/dashboard" target="_blank">dashboard</a>.</li>
                    <li>Click the bell icon to toggle notifications on and off.</li>
                </ol>
                <p>Note: If you unsubscribe from receiving emails via an alert email, this will disable email notifications.</p>
            `},{title:"I no longer receive any alerts for a host.",content:`
                <p>Only one host alert is sent until you reset that alert:</p>
                <p>On the 
                <a href="https://freenetworkmonitor.click/dashboard" target="_blank">dashboard host list</a>, click the red alert icon to reset the alert.</p>
            `},{title:"Network Monitor Assistant : How do I add a new host?",content:`
                <p><strong>User:</strong> How do I add a host?</p>
                <p><strong>Assistant:</strong> I can help you add a new host! Could you please provide the host address?</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> What type of service (endpoint) would you like to monitor? Options are HTTP, HTTPS, ICMP, DNS, etc.</p>
                <p><strong>User:</strong> HTTP</p>
                <p><strong>Assistant:</strong> Would you like to specify a port number, or should I use the default one?</p>
                <p><strong>User:</strong> Use the default.</p>
                <p><strong>Assistant:</strong> Got it! I’ve added <strong>example.com</strong> to your monitoring list using the HTTP service on the default port. You will start receiving alerts shortly.</p>
            `},{title:"Network Monitor Assistant : How do I edit an existing host?",content:`
                <p><strong>User:</strong> How do I edit a host?</p>
                <p><strong>Assistant:</strong> Sure! Please provide the host's address or ID that you want to edit.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> What would you like to change? You can enable/disable monitoring, change the endpoint type, or update the port.</p>
                <p><strong>User:</strong> Disable monitoring for now.</p>
                <p><strong>Assistant:</strong> Monitoring for <strong>example.com</strong> has been disabled.</p>
            `},{title:"Network Monitor Assistant : How do I view monitoring data for a host?",content:`
                <p><strong>User:</strong> How do I view monitoring data for a host?</p>
                <p><strong>Assistant:</strong> Which host would you like to view the data for? Please provide the address or ID.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Would you like a summary or detailed report?</p>
                <p><strong>User:</strong> A detailed report, please.</p>
                <p><strong>Assistant:</strong> Here is the detailed monitoring data for <strong>example.com</strong>: Uptime is 99.9%, average response time is 150ms, and no alerts in the past 24 hours.</p>
            `},{title:"Network Monitor Assistant : How do I get a list of all monitored hosts?",content:`
                <p><strong>User:</strong> Show me all my monitored hosts.</p>
                <p><strong>Assistant:</strong> Here's a list of your monitored hosts:</p>
                <ul>
                    <li><strong>example.com</strong> - HTTP</li>
                    <li><strong>anotherhost.com</strong> - ICMP</li>
                </ul>
                <p><strong>Assistant:</strong> Would you like more details about any of these hosts?</p>
            `},{title:"Network Monitor Assistant : How do I run a security assessment?",content:`
                <p><strong>User:</strong> Can you run a security scan?</p>
                <p><strong>Assistant:</strong> I can perform a security scan. Which host would you like to scan?</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Would you prefer an <strong>Nmap</strong> scan or an <strong>OpenSSL</strong> check?</p>
                <p><strong>User:</strong> Let's go with Nmap.</p>
                <p><strong>Assistant:</strong> Running an Nmap scan on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The scan has completed. No vulnerabilities were found.</p>
            `},{title:"Network Monitor Assistant : How do I request penetration testing?",content:`
                <p><strong>User:</strong> Can you run a penetration test on my host?</p>
                <p><strong>Assistant:</strong> I can help with that! However, I need confirmation that you have permission to test this server. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> Great! Which host would you like to test?</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Would you like to use a specific Metasploit module, or should I suggest one?</p>
                <p><strong>User:</strong> Use <strong>ms17_010_eternalblue</strong>.</p>
                <p><strong>Assistant:</strong> Running the <strong>ms17_010_eternalblue</strong> module on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The test has completed. No vulnerabilities were found.</p>
            `},{title:"Network Monitor Assistant : How do I run diagnostics with BusyBox?",content:`
                <p><strong>User:</strong> Can you help me run diagnostics on my host?</p>
                <p><strong>Assistant:</strong> I can run diagnostics, but I need to confirm that you have permission to perform this on the server. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> What diagnostics would you like to run? For example, you can ping an IP address.</p>
                <p><strong>User:</strong> Ping 8.8.8.8</p>
                <p><strong>Assistant:</strong> Running <strong>ping -c 4 8.8.8.8</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The ping has completed. All packets received successfully with an average response time of 30ms.</p>
            `},{title:"Network Monitor Assistant : How do I perform a web search?",content:`
                <p><strong>User:</strong> Can you help me search the web for network monitoring tools?</p>
                <p><strong>Assistant:</strong> Sure! Searching the web for <strong>network monitoring tools</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> Here are the top results:</p>
                <ul>
                    <li><strong>Tool A:</strong> A comprehensive solution for network monitoring.</li>
                    <li><strong>Tool B:</strong> A cloud-based monitoring tool.</li>
                </ul>
            `},{title:"Network Monitor Assistant : How do I crawl a web page for information?",content:`
                <p><strong>User:</strong> Can you extract information from a web page?</p>
                <p><strong>Assistant:</strong> Sure! Please provide the URL of the page you'd like to crawl.</p>
                <p><strong>User:</strong> https://example.com</p>
                <p><strong>Assistant:</strong> Crawling <strong>https://example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> Here's the information I extracted:</p>
                <ul>
                    <li><strong>Page title:</strong> Example Website</li>
                    <li><strong>Meta description:</strong> This is an example website for testing purposes.</li>
                </ul>
            `},{title:"Network Monitor Assistant : How do I retrieve my account information?",content:`
                <p><strong>User:</strong> Can you show me my account details?</p>
                <p><strong>Assistant:</strong> Sure! Here's your account information:</p>
                <ul>
                    <li><strong>Username:</strong> john_doe</li>
                    <li><strong>Email:</strong> john@example.com</li>
                    <li><strong>Monitored hosts:</strong> 5</li>
                </ul>
            `},{title:"Network Monitor Assistant : How do I run an Nmap scan?",content:`
                <p><strong>User:</strong> Can you run an Nmap scan on my host?</p>
                <p><strong>Assistant:</strong> Sure! But first, I need to confirm that you are authorized to scan this host. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> Great! Please provide the target host's IP or domain.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Running an Nmap scan on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The scan has completed. Open ports: 80 (HTTP), 443 (HTTPS).</p>
            `},{title:"Network Monitor Assistant : How do I run an SSL/TLS check?",content:`
                <p><strong>User:</strong> Can you check the SSL configuration of my website?</p>
                <p><strong>Assistant:</strong> Sure! Please provide the host address you'd like to check.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Running an SSL/TLS check on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The check has completed. The certificate is valid and uses <strong>TLS 1.2</strong>.</p>
            `},{title:"Network Monitor Assistant : How do I run a Metasploit module?",content:`
                <p><strong>User:</strong> Can you run a Metasploit module?</p>
                <p><strong>Assistant:</strong> I can run a Metasploit module, but first, I need confirmation that you are authorized to test the target. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> Great! Please provide the module name and the target host.</p>
                <p><strong>User:</strong> Use the <strong>exploit/windows/smb/ms17_010_eternalblue</strong> module on example.com.</p>
                <p><strong>Assistant:</strong> Running <strong>ms17_010_eternalblue</strong> on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The module has completed. No vulnerabilities were found.</p>
            `},{title:"Why can't I run certain functions like penetration tests or network scans?",content:`
                <p>Advanced functions such as penetration tests, security assessments, and network scans are only available in the <strong>Professional</strong> and <strong>Enterprise</strong> plans.</p>
                <p>If you're on the <strong>Free</strong> or <strong>Standard</strong> plan, these features are restricted. You can upgrade via the <a href="https://freenetworkmonitor.click/subscription">subscription page</a>.</p>
            `},{title:"How do I upgrade my subscription plan?",content:`
                <p>To upgrade your plan:</p>
                <ol>
                    <li>Go to the <a href="https://freenetworkmonitor.click/subscription">subscription page</a>.</li>
                    <li>Select the plan that suits your needs.</li>
                    <li>Follow the instructions to upgrade.</li>
                </ol>
                <p>After upgrading, new features will be available immediately.</p>
            `},{title:"What are the token limits in each plan?",content:`
                <p>The AI-powered assistants have token limits, which dictate the amount of data the AI can process daily:</p>
                <ul>
                    <li><strong>Free Plan:</strong> 50k max tokens, with 25k added daily.</li>
                    <li><strong>Standard Plan:</strong> 150k max tokens, with 50k added daily.</li>
                    <li><strong>Professional Plan:</strong> 750k max tokens, with 250k added daily.</li>
                    <li><strong>Enterprise Plan:</strong> 2000k max tokens, with 500k added daily.</li>
                </ul>
                <p>These limits reset daily, allowing you to run AI-driven tasks.</p>
            `},{title:"What features are available with the Free Plan?",content:`
                <p>The <strong>Free Plan</strong> includes:</p>
                <ul>
                    <li>10 hosts for monitoring.</li>
                    <li>Basic ICMP, HTTP, DNS, and SMTP ping checks.</li>
                    <li>Access to the FreeLLM Assistant for basic tasks.</li>
                    <li>Limited access to security insights.</li>
                    <li>50k max tokens for the Turbo AI Assistant, with 25k added daily.</li>
                    <li>One-month data retention.</li>
                </ul>
                <p>To access more hosts and advanced features, upgrade to the <strong>Standard</strong> or higher plan.</p>
            `},{title:"What features are included in the Standard Plan?",content:`
                <p>The <strong>Standard Plan</strong> ($1/mo) builds on the Free Plan and includes:</p>
                <ul>
                    <li>Monitor up to 50 hosts.</li>
                    <li>Advanced monitoring (ICMP, HTTP, DNS, Raw Connect, SMTP Ping, Quantum-Ready checks).</li>
                    <li>Local network monitoring with Network Monitor and Quantum Secure Agents.</li>
                    <li>150k max tokens for the Turbo AI Assistant (50k added daily).</li>
                    <li>Email support and six months of data retention.</li>
                </ul>
                <p>This plan is great for users who need more hosts and advanced monitoring capabilities beyond the Free Plan.</p>
            `},{title:"What does the Professional Plan offer?",content:`
                <p>The <strong>Professional Plan</strong> ($3/mo) builds on the Standard Plan and includes:</p>
                <ul>
                    <li>Monitor up to 300 hosts.</li>
                    <li>Conduct local and remote security assessments and penetration tests.</li>
                    <li>Comprehensive health checks (ICMP, HTTP, DNS, Raw Connect, SMTP Ping, Quantum-Ready checks).</li>
                    <li>750k max tokens for the Turbo AI Assistant (250k added daily).</li>
                    <li>Access to advanced security and penetration expert LLMs.</li>
                    <li>Two-year data retention.</li>
                </ul>
                <p>This plan is ideal for users needing enhanced security features and more extensive monitoring.</p>
            `},{title:"What features are in the Enterprise Plan?",content:`
                <p>The <strong>Enterprise Plan</strong> ($5/mo) builds on the Professional Plan and offers:</p>
                <ul>
                    <li>Monitor up to 500 hosts.</li>
                    <li>2000k max tokens for the Turbo AI Assistant (500k added daily).</li>
                    <li>Access to advanced system management through BusyBox commands.</li>
                    <li>Unlimited data retention and export options.</li>
                    <li>Priority support with a dedicated monitor service agent in a data center.</li>
                </ul>
                <p>This plan is designed for large-scale networks that require real-time monitoring and advanced security features.</p>
            `},{title:"How do I know which plan is right for me?",content:`
                <p>The best plan depends on your monitoring needs:</p>
                <ul>
                    <li><strong>Free Plan:</strong> Suitable for small networks with fewer than 10 hosts.</li>
                    <li><strong>Standard Plan:</strong> Ideal for monitoring up to 50 hosts with local network monitoring.</li>
                    <li><strong>Professional Plan:</strong> Great for users needing security checks and up to 300 hosts.</li>
                    <li><strong>Enterprise Plan:</strong> Best for large networks and those requiring advanced features and up to 500 hosts.</li>
                </ul>
                <p>You can always upgrade your plan as your network monitoring needs evolve.</p>
            `},{title:"How do I add websites and hosts to monitor?",content:`You must first login to add hosts. Goto the dashboard page and click login.
            If you dont already have an account then create an account when given this option. When you have logged in then click the edit icon top left next to login icon. For a visual guide see guide number 2 above.`},{title:"How do I receive alerts?",content:"Alerts are automatically sent to the email address you have associated with your login. As long as you are still subscribed to receive alerts there is nothing additional you need to do."},{title:"How do I install the Network Monitor Agent on Android?",content:`
                <p>You can download the Free Network Monitor Agent app from the 
                <a href="https://play.google.com/store/apps/details?id=click.freenetworkmonitor.networkmonitormaui">Google Play Store</a> 
                or the <a href="https://play.google.com/store/apps/details?id=click.freenetworkmonitor.quantumsecure">Quantum Secure Agent</a>. 
                Follow the installation instructions, and after the app is installed, enable the agent and follow the post-installation steps to start monitoring.</p>
            `},{title:"How do I install the Network Monitor Agent on Windows?",content:`
                <p>The Network Monitor Agent can be installed from the 
                <a href="https://www.microsoft.com/store/apps/9PFJ3203JWDT">Microsoft Store</a> for Windows. 
                If you are using the Quantum Secure Agent, you can find it 
                <a href="https://www.microsoft.com/store/apps/9NXT248W9NR6">here</a>. 
                After installation, enable the agent and complete the post-installation steps to authorize and manage your monitoring.</p>
            `},{title:"What are the post-installation steps after installing the agent?",content:`
                <ol>
                    <li>Toggle the "Enable Agent" slider to activate the agent.</li>
                    <li>Authorize the agent by logging in through OAuth when prompted.</li>
                    <li>Login to the Free Network Monitor Dashboard using the same email to manage your monitoring setup.</li>
                    <li>Add hosts for monitoring by selecting the appropriate IP addresses and monitor location.</li>
                </ol>
            `},{title:"What are the limitations of the Android version of the agent?",content:`
                <p>Due to Android’s battery-saving features, the polling frequency may be reduced when the device is not connected to a charger. 
                If you require continuous monitoring without this limitation, consider using the Docker version of the agent.</p>
            `},{title:"How do I install the Network Monitor Agent using Docker?",content:`
                <p>To install using Docker, first install Docker Desktop, which includes Docker Compose. 
                Then, create a <code>docker-compose.yml</code> file as shown in the 
                <a href="https://docs.docker.com/get-docker/">documentation</a> and run the 
                <code>docker-compose up -d</code> command to start the container. 
                Follow the logs for the authorization URL and complete the authorization process to start monitoring.</p>
            `},{title:"How do I authorize the Docker version of the agent?",content:`
                <ol>
                    <li>After starting the Docker container, view the logs with the command <code>docker logs processor -f</code>.</li>
                    <li>Look for the OAuth authorization URL in the logs, and visit the link to complete the authentication process.</li>
                </ol>
            `},{title:"How do I add hosts for monitoring using the Docker agent?",content:`
                <ol>
                    <li>Once the Docker agent is authorized, go to the 
                    <a href="https://freenetworkmonitor.click/dashboard">Free Network Monitor Dashboard</a> to add hosts.</li>
                    <li>Select a monitor location and the endpoint type (e.g., 'icmp' for ping monitoring), and switch between view and edit modes to monitor your hosts.</li>
                </ol>
            `},{title:"How do I view monitoring data for hosts?",content:`
                <p>You can view monitoring data through the Free Network Monitor Dashboard or directly in the Agent App. 
                In the app, host statuses are represented by indicator circles. Click the circle to get more detailed monitoring information, 
                with visual effects such as pulsing and beacon effects to represent response time and reliability.</p>
            `},{title:"How do I set up alerts and reports for monitored hosts?",content:`
                <p>You’ll receive email alerts if a host goes down, and weekly reports analyzing the performance of your hosts. 
                Be sure to verify your email address to receive these notifications. If you don’t see the verification email, 
                whitelist <a href="mailto:support@mahadeva.co.uk">support@mahadeva.co.uk</a> to ensure it reaches your inbox.</p>
            `},{title:"What is a Local Agent?",content:`
                <p>A Local Agent is an agent that you install and run on a device within your local network, such as a computer, phone, or a Docker container. 
                It monitors devices and services that are accessible from your local network, such as routers, local servers, or other private network devices.</p>
                <p>Local Agents provide visibility into network devices that are not publicly accessible and offer insights into the health of your local infrastructure.</p>
            `},{title:"What is an Internet-Based Agent provided by Free Network Monitor?",content:`
                <p>Internet-Based Agents are managed by the Free Network Monitor service and operate from predefined global locations. 
                These agents monitor public-facing services like websites or cloud servers and are ideal for tracking availability and performance from different regions.</p>
                <p>Unlike Local Agents, Internet-Based Agents do not need to be installed or configured by the user and are ready to use via the dashboard.</p>
            `},{title:"When should I use a Local Agent?",content:`
                <p>You should use a Local Agent when you need to monitor devices or services within your private network that are not accessible to the internet. 
                This is ideal for checking the availability of routers, local servers, or other internal devices. Local Agents give you full control and visibility over your private network.</p>
            `},{title:"When should I use an Internet-Based Agent?",content:`
                <p>Use an Internet-Based Agent when monitoring public-facing services such as websites, public servers, or cloud services. 
                These agents are useful for ensuring that your services are accessible and performing well from different global locations.</p>
            `},{title:"Can I use both a Local Agent and an Internet-Based Agent together?",content:`
                <p>Yes, you can use both types of agents together. For example, you can use a Local Agent to monitor internal devices like routers and servers, 
                while using an Internet-Based Agent to monitor public-facing services like websites or cloud applications. This gives you a complete view of your infrastructure.</p>
            `},{title:"How do I use the penetration testing function of the Network Monitor Local Agents?",content:`
                <p>The penetration testing function of the Network Monitor Agent requires Metasploit to be installed:</p>
                <ul>
                    <li><strong>Docker Version:</strong> The Docker version of the agent has Metasploit pre-installed, so no additional setup is required.</li>
                    <li><strong>Windows Version:</strong> You need to manually install Metasploit and ensure it is accessible via the system's <code>PATH</code>. 
                    For installation instructions, refer to the <a href="https://www.metasploit.com/download" target="_blank">Metasploit official site</a>.</li>
                    <li><strong>Android Version:</strong> Metasploit is not available for Android at this time, so the penetration testing function is unavailable on this platform.</li>
                </ul>
            `},{title:"What is the difference between the Free Network Monitor Agent and the Quantum Secure Agent?",content:`
                <p>The Free Network Monitor Agent and the Quantum Secure Agent are nearly identical in functionality. 
                However, the Quantum Secure Agent includes additional features that allow it to scan your local network for devices and monitor whether they are using 
                quantum-safe TLS KEM (Key Encapsulation Mechanism) encryption. This makes the Quantum Secure Agent ideal for environments where quantum-safe encryption 
                is a priority for network security.</p>
            `}]},Ct=()=>{const t=ut(),n=ht(gt(t,"undefined/ping.svg")),[e,a]=p.useState(!1),[c,i]=p.useState(!1),[s,d]=p.useState(""),u=()=>{a(!0)},l=()=>{a(!1)},g=G.rows.filter(h=>h.title.toLowerCase().includes(s.toLowerCase())||h.content.toLowerCase().includes(s.toLowerCase())),m={...G,rows:g},b={bgColor:"rgba(255,255,255,0.8)",titleTextColor:t.palette.secondary.light,rowTitleColor:t.palette.primary.dark,rowContentColor:t.palette.primary.light,arrowColor:t.palette.error.light},k={animate:!0,arrowIcon:"v",tabFocus:!0};return r.jsxs("div",{className:n.root,children:[r.jsx(dt,{}),r.jsxs(ft,{children:[r.jsx("title",{children:"Free Network Monitor FAQ Support"}),r.jsx("meta",{name:"description",content:"This page provides support answers for user of free network monitor."})]}),r.jsx(wt,{position:"absolute",className:S(n.appBar,e&&n.appBarShift),children:r.jsxs(mt,{className:n.toolbar,children:[c&&r.jsx(pt,{small:!0}),r.jsx(E,{edge:"start",color:"inherit","aria-label":"open drawer",onClick:u,className:S(n.menuButton,e&&n.menuButtonHidden),size:"large",children:r.jsx(yt,{})}),r.jsx(_t,{}),r.jsx(T,{sx:{paddingLeft:4},component:"h1",color:"inherit",noWrap:!0,className:n.title,children:"Free Network Monitor"})]})}),r.jsxs(vt,{variant:"permanent",classes:{paper:S(n.drawerPaper,!e&&n.drawerPaperClose)},open:e,children:[r.jsx("div",{className:n.toolbarIcon,children:r.jsx(E,{onClick:l,size:"large",children:r.jsx(bt,{})})}),r.jsx(R,{}),r.jsx(kt,{children:r.jsx(xt,{classes:n})}),r.jsx(R,{})]}),r.jsxs("main",{className:n.content,children:[r.jsx("div",{className:n.appBarSpacer}),r.jsxs(At,{maxWidth:"lg",className:n.container,children:[r.jsx(w,{container:!0,spacing:6,children:r.jsx(w,{item:!0,xs:12,children:r.jsx(w,{container:!0,direction:"row",justifyContent:"space-evenly",alignItems:"center",children:r.jsx(w,{align:"center",children:r.jsxs(w,{container:!0,direction:"column",justifyContent:"space-around",alignItems:"center",children:[r.jsx(w,{item:!0,children:r.jsx(T,{color:"primary",variant:"h2",children:"Free Network Monitor"})}),r.jsx(w,{item:!0,children:r.jsx(T,{color:"secondary",variant:"h4",children:"FAQ"})})]})})})})}),r.jsx("hr",{}),r.jsx(w,{align:"center",children:r.jsxs(w,{container:!0,direction:"rows",justifyContent:"space-around",alignItems:"center",children:[r.jsx(w,{item:!0,children:r.jsx(T,{variant:"body2",color:"textSecondary",align:"center",children:r.jsx(Q,{to:"/#blog-post1",scroll:h=>h.scrollIntoView({behavior:"smooth",block:"start"}),className:n.link,children:"Visual Guide 1 : View Charts"})})}),r.jsx(w,{item:!0,children:r.jsx(T,{variant:"body2",color:"textSecondary",align:"center",children:r.jsx(Q,{to:"/#blog-post2",scroll:h=>h.scrollIntoView({behavior:"smooth",block:"start"}),className:n.link,children:"Visual Guide 2 : Add Hosts"})})})]})}),r.jsx("hr",{}),r.jsx(w,{container:!0,justifyContent:"center",children:r.jsx(w,{item:!0,xs:12,sm:6,children:r.jsx(Tt,{label:"Search FAQs",variant:"outlined",fullWidth:!0,value:s,onChange:h=>d(h.target.value)})})}),r.jsx("hr",{}),r.jsx(ot,{data:m,styles:b,config:k}),r.jsx("hr",{}),r.jsx(It,{})]})]})]})},qt=p.memo(Ct);export{qt as default};
