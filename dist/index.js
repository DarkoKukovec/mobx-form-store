module.exports=function(t){function e(o){if(r[o])return r[o].exports;var i=r[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r(1);Object.defineProperty(e,"FormStore",{enumerable:!0,get:function(){return o.FormStore}});var i=r(3);Object.defineProperty(e,"FormFieldStore",{enumerable:!0,get:function(){return i.FormFieldStore}});var n=r(4);Object.defineProperty(e,"progressEnum",{enumerable:!0,get:function(){return n.progressEnum}})},function(t,e,r){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,r,o,i){var n={};return Object.keys(o).forEach(function(t){n[t]=o[t]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,o){return o(t,e,r)||r},n),i&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(i):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(t,e,n),n=null),n}Object.defineProperty(e,"__esModule",{value:!0}),e.FormStore=void 0;var n,s=function(){function t(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}}(),a=r(2),u=r(3),c=r(4),p=r(5),l=r(6),d=r(7);e.FormStore=(n=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.submitAction,i=e.validators,n=void 0===i?{}:i,s=e.fields,u=void 0===s?{}:s,c=e.response,p=void 0===c?null:c,l=e.actionErrors,d=void 0===l?[]:l;o(this,t),this.submitAction=r;var f=this._initValidators(n),y={response:p,loading:!1,fields:this._initFields(u,n,f),_actionErrors:d};(0,a.extendObservable)(this,y)}return s(t,[{key:"_initValidators",value:function(t){var e=this,r={required:l.required.bind(this),minLength:l.minLength.bind(this),maxLength:l.maxLength.bind(this),email:l.email.bind(this),equals:l.equals.bind(this)};return Object.keys(t).map(function(o){return r[o]=t[o].bind(e)}),r}},{key:"_initFields",value:function(t,e,r){var o={},i=!0,n=!1,s=void 0;try{for(var a,c=Object.keys(t)[Symbol.iterator]();!(i=(a=c.next()).done);i=!0){var p=a.value,l=t[p]||{},d=Object.assign({name:p,validators:e,validatorFunctions:r,value:l.value,actionErrors:l.actionErrors||[]},l);o[p]=new u.FormFieldStore(d)}}catch(t){n=!0,s=t}finally{try{!i&&c.return&&c.return()}finally{if(n)throw s}}return o}},{key:"_setAactionErrors",value:function(t){var e=this;this.resetActionErrors(),t.forEach(function(t){var r=e.fieldList.find(function(e){return e.name===t.field});r?r.addAactionError(t):e._actionErrors.push(t)})}},{key:"reset",value:function(){this.fieldList.map(function(t){return t.reset()}),this.response=null,this.loading=!1,this.resetActionErrors()}},{key:"resetActionErrors",value:function(){this._actionErrors=[],this.fieldList.map(function(t){return t.resetActionErrors()})}},{key:"submit",value:function(){if(this.loading)return this.loading;if(!this.submitAction)return Promise.reject(d.missingSubmitAction);var t=this.submitAction(this.formData);return t instanceof Promise?(this.loading=this._processSubmitAction(t),this.loading):Promise.reject(d.notPromiseSubmitAction)}},{key:"_processSubmitAction",value:function(t){var e=this;return t.then(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,a.runInAction)(function(){e.response=t,e.fieldList.map(function(t){return t.resetInitialValue()}),e.resetActionErrors()})}).catch(function(t){return(0,a.runInAction)(function(){e.response=null,e.loading=!1}),t instanceof Error?Promise.reject(t):t instanceof Array?(e._setAactionErrors(t),Promise.resolve()):Promise.reject(d.notArrayActionErrors)})}},{key:"toJS",value:function(){var t=this.fieldList.map(function(t){return t.toJS()});return{actionErrors:(0,a.toJS)(this._actionErrors),response:(0,a.toJS)(this.response),fields:(0,p.mapValues)(t,"name")}}},{key:"valid",get:function(){return this.fieldList.every(function(t){return t.valid})}},{key:"dirty",get:function(){return this.fieldList.some(function(t){return t.dirty})}},{key:"isSubmitted",get:function(){return Boolean(this.response)}},{key:"errors",get:function(){return(0,p.mapValues)(this.fieldList,"name","errors")}},{key:"actionErrors",get:function(){return this._actionErrors}},{key:"formData",get:function(){return(0,p.mapValues)(this.fieldList,"name","value")}},{key:"fieldList",get:function(){return Object.values(this.fields)}},{key:"progress",get:function(){return this.isSubmitted?c.progressEnum.DONE:this.loading?c.progressEnum.IN_PROGRESS:this.actionErrors.length>0?c.progressEnum.ERROR:c.progressEnum.NONE}}]),t}(),i(n.prototype,"valid",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"valid"),n.prototype),i(n.prototype,"dirty",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"dirty"),n.prototype),i(n.prototype,"isSubmitted",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"isSubmitted"),n.prototype),i(n.prototype,"errors",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"errors"),n.prototype),i(n.prototype,"actionErrors",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"actionErrors"),n.prototype),i(n.prototype,"formData",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"formData"),n.prototype),i(n.prototype,"fieldList",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"fieldList"),n.prototype),i(n.prototype,"progress",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"progress"),n.prototype),i(n.prototype,"_setAactionErrors",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"_setAactionErrors"),n.prototype),i(n.prototype,"reset",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"reset"),n.prototype),i(n.prototype,"resetActionErrors",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"resetActionErrors"),n.prototype),i(n.prototype,"submit",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"submit"),n.prototype),n)},function(t,e){t.exports=require("mobx")},function(t,e,r){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,r,o,i){var n={};return Object.keys(o).forEach(function(t){n[t]=o[t]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,o){return o(t,e,r)||r},n),i&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(i):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(t,e,n),n=null),n}Object.defineProperty(e,"__esModule",{value:!0}),e.FormFieldStore=void 0;var n,s=function(){function t(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}}(),a=r(2);e.FormFieldStore=(n=function(){function t(e){var r=e.name,i=e.value,n=e.initialValue,s=void 0===n?i:n,u=e.actionErrors,c=e.validators,p=e.validatorFunctions;o(this,t),this._validatorFunctions=p;var l={name:r,validators:c,initialValue:s||null,value:i||null,_actionErrors:u};(0,a.extendObservable)(this,l)}return s(t,[{key:"reset",value:function(){this.resetActionErrors(),this.value=this.initialValue}},{key:"resetActionErrors",value:function(){this._actionErrors=[]}},{key:"resetInitialValue",value:function(){this.initialValue=this.value}},{key:"addAactionError",value:function(t){this._actionErrors.push(t)}},{key:"toJS",value:function(){return{actionErrors:(0,a.toJS)(this.actionErrors),initialValue:this.dirty?this.initialValue:void 0,name:this.name,value:this.value,validators:(0,a.toJS)(this.validators)}}},{key:"valid",get:function(){return this.errors.length<=0}},{key:"errors",get:function(){var t=this;return Object.keys(this.validators).filter(function(e){var r=t.validators[e];return"boolean"==typeof r?r&&!t._validatorFunctions[e](t):!t._validatorFunctions[e](t,r)})}},{key:"actionErrors",get:function(){return this._actionErrors}},{key:"dirty",get:function(){return this.initialValue!==this.value}}]),t}(),i(n.prototype,"valid",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"valid"),n.prototype),i(n.prototype,"errors",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"errors"),n.prototype),i(n.prototype,"actionErrors",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"actionErrors"),n.prototype),i(n.prototype,"dirty",[a.computed],Object.getOwnPropertyDescriptor(n.prototype,"dirty"),n.prototype),i(n.prototype,"reset",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"reset"),n.prototype),i(n.prototype,"resetActionErrors",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"resetActionErrors"),n.prototype),i(n.prototype,"resetInitialValue",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"resetInitialValue"),n.prototype),i(n.prototype,"addAactionError",[a.action],Object.getOwnPropertyDescriptor(n.prototype,"addAactionError"),n.prototype),n)},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.progressEnum={NONE:"none",IN_PROGRESS:"inProgress",DONE:"done",ERROR:"error"}},function(t,e){"use strict";function r(t,e,r){var o={};return t.forEach(function(t){o[t[e]]=r?t[r]:t}),o}function o(){}Object.defineProperty(e,"__esModule",{value:!0}),e.mapValues=r,e.noop=o},function(t,e){"use strict";function r(t){return Boolean(t.value)||0===t.value}function o(t,e){return!!t.value&&(t.value.length>=e||!t.value.length)}function i(t,e){return!!t.value&&t.value.length<=e}function n(t){return a.test(t.value)}function s(t,e){return t.value===this.fields[e].value}Object.defineProperty(e,"__esModule",{value:!0}),e.required=r,e.minLength=o,e.maxLength=i,e.email=n,e.equals=s;var a=/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r="[mobx-form-store]",o="https://example.com";e.missingSubmitAction=r+" submitAction method is not defined or not a function. This method allows you to call submit() on the form. Read through the documentation "+o+"/test for examles and information about this.",e.notPromiseSubmitAction=r+" submitAction has to be a promise. Read through the documentation "+o+"/test for examles and information about this.",e.notArrayActionErrors=r+" action errors rejected from submitAction need to be in an array. Read through the documentation "+o+"/test for examles and information about this."}]);