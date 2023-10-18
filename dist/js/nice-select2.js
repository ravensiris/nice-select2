!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.NiceSelect=t():e.NiceSelect=t()}(self,(()=>(()=>{"use strict";var e={d:(t,s)=>{for(var i in s)e.o(s,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:s[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function s(e){const t=document.createEvent("MouseEvents");t.initEvent("click",!0,!1),e.dispatchEvent(t)}function i(e){const t=document.createEvent("HTMLEvents");t.initEvent("change",!0,!1),e.dispatchEvent(t)}function o(e){const t=document.createEvent("FocusEvent");t.initEvent("focusin",!0,!1),e.dispatchEvent(t)}function n(e){const t=document.createEvent("FocusEvent");t.initEvent("focusout",!0,!1),e.dispatchEvent(t)}function d(e){const t=document.createEvent("UIEvent");t.initEvent("modalclose",!0,!1),e.dispatchEvent(t)}function l(e,t){"invalid"===t?(a(this.dropdown,"invalid"),h(this.dropdown,"valid")):(a(this.dropdown,"valid"),h(this.dropdown,"invalid"))}function c(e,t){return void 0!==e[t]?e[t]:e.getAttribute(t)}function r(e,t){return!!e&&e.classList.contains(t)}function a(e,t){if(e)return e.classList.add(t)}function h(e,t){if(e)return e.classList.remove(t)}e.r(t),e.d(t,{bind:()=>f,default:()=>u});const p={data:null,searchable:!1,showSelectedItems:!1};function u(e,t){this.el=e,this.config=Object.assign({},p,t||{}),this.data=this.config.data,this.selectedOptions=[],this.placeholder=c(this.el,"placeholder")||this.config.placeholder||"Select an option",this.searchtext=c(this.el,"searchtext")||this.config.searchtext||"Search",this.selectedtext=c(this.el,"selectedtext")||this.config.selectedtext||"selected",this.dropdown=null,this.multiple=c(this.el,"multiple"),this.disabled=c(this.el,"disabled"),this.create()}function f(e,t){return new u(e,t)}return u.prototype.create=function(){this.el.style.opacity="0",this.el.style.width="0",this.el.style.padding="0",this.el.style.height="0",this.data?this.processData(this.data):this.extractData(),this.renderDropdown(),this.bindEvent()},u.prototype.processData=function(e){const t=[];e.forEach((e=>{t.push({data:e,attributes:{selected:!!e.selected,disabled:!!e.disabled,optgroup:"optgroup"===e.value,classList:e.classList}})})),this.options=t},u.prototype.extractData=function(){const e=this.el.querySelectorAll("option,optgroup"),t=[],s=[],i=[];e.forEach((e=>{let i;if("OPTGROUP"===e.tagName)i={text:e.label,value:"optgroup"};else{let t=e.innerText;void 0!==e.dataset.display&&(t=e.dataset.display);const s=e.dataset.selectedClass;i={text:t,value:e.value,selected:null!=e.getAttribute("selected"),disabled:null!=e.getAttribute("disabled"),classList:e.classList,selectedClass:s}}const o={selected:null!=e.getAttribute("selected"),disabled:null!=e.getAttribute("disabled"),optgroup:"OPTGROUP"===e.tagName,classList:e.classList};t.push(i),s.push({data:i,attributes:o})})),this.data=t,this.options=s,this.options.forEach((e=>{e.attributes.selected&&i.push(e)})),this.selectedOptions=i},u.prototype.renderDropdown=function(){const e=["nice-select",c(this.el,"class")||"",this.disabled?"disabled":"",this.multiple?"has-multiple":""];let t='<div class="nice-select-search-box">';t+=`<input type="text" class="nice-select-search" placeholder="${this.searchtext}..." title="search"/>`,t+="</div>";let s=`<div class="${e.join(" ")}" tabindex="${this.disabled?null:0}">`;s+=`<span class="${this.multiple?"multiple-options":"current"}"></span>`,s+='<div class="nice-select-dropdown">',s+=`${this.config.searchable?t:""}`,s+='<ul class="list"></ul>',s+="</div>",s+="</div>",this.el.insertAdjacentHTML("afterend",s),this.dropdown=this.el.nextElementSibling,this._renderSelectedItems(),this._renderItems()},u.prototype._renderSelectedItems=function(){if(this.multiple){let e="";this.config.showSelectedItems||this.config.showSelectedItems||"auto"===window.getComputedStyle(this.dropdown).width||this.selectedOptions.length<2?(this.selectedOptions.forEach((function(t){e+=`<span class="current">${t.data.text}</span>`})),e=""===e?this.placeholder:e):e=this.selectedOptions.length+" "+this.selectedtext,this.dropdown.querySelector(".multiple-options").innerHTML=e}else{const e=this.selectedOptions.length>0?this.selectedOptions[0].data.text:this.placeholder,t=this.selectedOptions[0]?.data.selectedClass,s=this.dropdown.querySelector(".current");s.innerHTML=e,s.className=t?`current ${t}`:"current"}},u.prototype._renderItems=function(){const e=this.dropdown.querySelector("ul");this.options.forEach((t=>{e.appendChild(this._renderItem(t))}))},u.prototype._renderItem=function(e){const t=document.createElement("li");if(t.innerHTML=e.data.text,e.attributes.optgroup)a(t,"optgroup");else{t.setAttribute("data-value",e.data.value);const s=["option",e.attributes.selected?"selected":void 0,e.attributes.disabled?"disabled":void 0].filter((e=>void 0!==e));e.attributes.classList&&s.push(...e.attributes.classList),t.addEventListener("click",this._onItemClicked.bind(this,e)),t.classList.add(...s)}return e.element=t,t},u.prototype.update=function(){if(this.extractData(),this.dropdown){const e=r(this.dropdown,"open");this.dropdown.parentNode.removeChild(this.dropdown),this.create(),e&&s(this.dropdown)}c(this.el,"disabled")?this.disable():this.enable()},u.prototype.disable=function(){this.disabled||(this.disabled=!0,a(this.dropdown,"disabled"))},u.prototype.enable=function(){this.disabled&&(this.disabled=!1,h(this.dropdown,"disabled"))},u.prototype.clear=function(){this.resetSelectValue(),this.selectedOptions=[],this._renderSelectedItems(),this.update(),i(this.el)},u.prototype.destroy=function(){this.dropdown&&(this.dropdown.parentNode.removeChild(this.dropdown),this.el.style.display="")},u.prototype.bindEvent=function(){this.dropdown.addEventListener("click",this._onClicked.bind(this)),this.dropdown.addEventListener("keydown",this._onKeyPressed.bind(this)),this.dropdown.addEventListener("focusin",o.bind(this,this.el)),this.dropdown.addEventListener("focusout",n.bind(this,this.el)),this.el.addEventListener("invalid",l.bind(this,this.el,"invalid")),window.addEventListener("click",this._onClickedOutside.bind(this)),this.config.searchable&&this._bindSearchEvent()},u.prototype._bindSearchEvent=function(){const e=this.dropdown.querySelector(".nice-select-search");e&&e.addEventListener("click",(function(e){return e.stopPropagation(),!1})),e.addEventListener("input",this._onSearchChanged.bind(this))},u.prototype._onClicked=function(e){if(e.preventDefault(),r(this.dropdown,"open")?this.multiple?e.target===this.dropdown.querySelector(".multiple-options")&&(h(this.dropdown,"open"),d(this.el)):(h(this.dropdown,"open"),d(this.el)):(a(this.dropdown,"open"),function(e){const t=document.createEvent("UIEvent");t.initEvent("modalopen",!0,!1),e.dispatchEvent(t)}(this.el)),r(this.dropdown,"open")){const e=this.dropdown.querySelector(".nice-select-search");e&&(e.value="",e.focus());let t=this.dropdown.querySelector(".focus");h(t,"focus"),t=this.dropdown.querySelector(".selected"),a(t,"focus"),this.dropdown.querySelectorAll("ul li").forEach((function(e){e.style.display=""}))}else this.dropdown.focus()},u.prototype._onItemClicked=function(e,t){const s=t.target;r(s,"disabled")||(this.multiple?r(s,"selected")?(h(s,"selected"),this.selectedOptions.splice(this.selectedOptions.indexOf(e),1),this.el.querySelector(`option[value="${s.dataset.value}"]`).removeAttribute("selected")):(a(s,"selected"),this.selectedOptions.push(e)):(this.options.forEach((function(e){h(e.element,"selected")})),this.selectedOptions.forEach((function(e){h(e.element,"selected")})),a(s,"selected"),this.selectedOptions=[e]),this._renderSelectedItems(),this.updateSelectValue())},u.prototype.updateSelectValue=function(){if(this.multiple){const e=this.el;this.selectedOptions.forEach((function(t){const s=e.querySelector(`option[value="${t.data.value}"]`);s&&s.setAttribute("selected",!0)}))}else this.selectedOptions.length>0&&(this.el.value=this.selectedOptions[0].data.value);i(this.el)},u.prototype.resetSelectValue=function(){if(this.multiple){const e=this.el;this.selectedOptions.forEach((function(t){const s=e.querySelector(`option[value="${t.data.value}"]`);s&&s.removeAttribute("selected")}))}else this.selectedOptions.length>0&&(this.el.selectedIndex=-1);i(this.el)},u.prototype._onClickedOutside=function(e){this.dropdown.contains(e.target)||(h(this.dropdown,"open"),d(this.el))},u.prototype._onKeyPressed=function(e){const t=this.dropdown.querySelector(".focus"),i=r(this.dropdown,"open");if(13===e.keyCode)s(i?t:this.dropdown);else if(40===e.keyCode){if(i){const e=this._findNext(t);e&&(h(this.dropdown.querySelector(".focus"),"focus"),a(e,"focus"))}else s(this.dropdown);e.preventDefault()}else if(38===e.keyCode){if(i){const e=this._findPrev(t);e&&(h(this.dropdown.querySelector(".focus"),"focus"),a(e,"focus"))}else s(this.dropdown);e.preventDefault()}else if(27===e.keyCode&&i)s(this.dropdown);else if(32===e.keyCode&&i)return!1;return!1},u.prototype._findNext=function(e){for(e=e?e.nextElementSibling:this.dropdown.querySelector(".list .option");e;){if(!r(e,"disabled")&&"none"!==e.style.display)return e;e=e.nextElementSibling}return null},u.prototype._findPrev=function(e){for(e=e?e.previousElementSibling:this.dropdown.querySelector(".list .option:last-child");e;){if(!r(e,"disabled")&&"none"!==e.style.display)return e;e=e.previousElementSibling}return null},u.prototype._onSearchChanged=function(e){const t=r(this.dropdown,"open");let s=e.target.value;if(s=s.toLowerCase(),""===s)this.options.forEach((function(e){e.element.style.display=""}));else if(t){const e=new RegExp(s);this.options.forEach((function(t){const s=t.data.text.toLowerCase(),i=e.test(s);t.element.style.display=i?"":"none"}))}this.dropdown.querySelectorAll(".focus").forEach((function(e){h(e,"focus")})),a(this._findNext(null),"focus")},t})()));