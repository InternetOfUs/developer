"use strict";(self.webpackChunkdeveloper_site=self.webpackChunkdeveloper_site||[]).push([[197],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),f=l(n),m=a,d=f["".concat(c,".").concat(m)]||f[m]||u[m]||o;return n?r.createElement(d,s(s({ref:t},p),{},{components:n})):r.createElement(d,s({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=f;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var l=2;l<o;l++)s[l]=n[l];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},2711:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return p},default:function(){return f}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),s=["components"],i={title:"Task manager",sidebar_label:"Task manager"},c=void 0,l={unversionedId:"platform/task-manager",id:"platform/task-manager",isDocsHomePage:!1,title:"Task manager",description:"The task manager component is the one responsible for storing and maintaining",source:"@site/docs/platform/task-manager.md",sourceDirName:"platform",slug:"/platform/task-manager",permalink:"/developer/docs/platform/task-manager",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/platform/task-manager.md",tags:[],version:"current",lastUpdatedAt:1645787856,formattedLastUpdatedAt:"2/25/2022",frontMatter:{title:"Task manager",sidebar_label:"Task manager"},sidebar:"pilot",previous:{title:"Profile Manager",permalink:"/developer/docs/platform/profile-manager"},next:{title:"Interaction Protocol Engine",permalink:"/developer/docs/platform/interaction-protocol-engine"}},p=[],u={toc:p};function f(e){var t=e.components,n=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The task manager component is the one responsible for storing and maintaining\nthe task and task types. The task types define the interaction protocols between users\nand the task is an instance of this type."),(0,o.kt)("p",null,"The task type uses the ",(0,o.kt)("a",{parentName:"p",href:"https://swagger.io/specification/"},"OpenAPI")," to define\nthe possible attributes of a task, the actions or transactions that a user can do\nin a task, and the messages or callbacks that can be posted to the application\nfrom the task execution. Also, it has a set of norms that describe the behaviour\nof the user on the task execution."),(0,o.kt)("p",null,"When a set of users want to be coordinated to do something one of them create a new task.\nThis task has associated a type that describes the behaviour of the user on this execution.\nThe creator of the task, if wants, can define new norms that can modify this default\nbehaviour. The task manager is also responsible for maintaining the state of this task execution.\nFor this reason on the task model are stored all the transactions that have been done\non it, and on this transaction are stored the messages that has been sent to the application\nwhen this transaction is executed. As well, it provides services that can be used\nto obtain the messages sent to the users by the application callbacks."))}f.isMDXComponent=!0}}]);