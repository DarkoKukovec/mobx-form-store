module.exports=function(t){function e(o){if(r[o])return r[o].exports;var i=r[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r(1);Object.defineProperty(e,"FormStore",{enumerable:!0,get:function(){return o.FormStore}});var i=r(3);Object.defineProperty(e,"FormFieldStore",{enumerable:!0,get:function(){return i.FormFieldStore}});var n=r(5);Object.defineProperty(e,"progressEnum",{enumerable:!0,get:function(){return n.progressEnum}})},function(t,e,r){"use strict";function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e,r,o,i){var n={};return Object.keys(o).forEach(function(t){n[t]=o[t]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,o){return o(t,e,r)||r},n),i&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(i):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(t,e,n),n=null),n}Object.defineProperty(e,"__esModule",{value:!0}),e.FormStore=void 0;var a,s=function(){function t(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}}(),u=r(2),c=r(3),l=r(4),p=o(l),f=r(5),d=r(6),y=r(7);e.FormStore=(a=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.submitAction,o=void 0===r?d.noop:r,n=e.validators,a=void 0===n?{}:n,s=e.fields,c=void 0===s?{}:s,l=e.response,p=void 0===l?null:l,f=e.actionErrors,y=void 0===f?[]:f;i(this,t),this.submitAction=o;var v=this._initValidators(a),m={response:p,loading:!1,fields:this._initFields(c,a,v),_actionErrors:y};(0,u.extendObservable)(this,m)}return s(t,[{key:"_initValidators",value:function(t){var e={required:y.required,minLength:y.minLength,maxLength:y.maxLength,email:y.email,equals:y.equals};return Object.assign(e,t)}},{key:"_initFields",value:function(t,e,r){var o={},i=!0,n=!1,a=void 0;try{for(var s,u=Object.keys(t)[Symbol.iterator]();!(i=(s=u.next()).done);i=!0){var l=s.value,p=t[l]||{},f=Object.assign({name:l,validators:e,validatorFunctions:r,value:p.value,actionErrors:p.actionErrors||[]},p);o[l]=new c.FormFieldStore(f)}}catch(t){n=!0,a=t}finally{try{!i&&u.return&&u.return()}finally{if(n)throw a}}return o}},{key:"_setAactionErrors",value:function(t){var e=this;this.resetActionErrors(),t.forEach(function(t){var r=e.fieldList.find(function(e){return e.name===t.field});r?r.addAactionError(t):e._actionErrors.push(t)})}},{key:"reset",value:function(){this.fieldList.map(function(t){return t.reset()}),this.response=!1,this.loading=!1,this.resetActionErrors()}},{key:"resetActionErrors",value:function(){this._actionErrors=[],this.fieldList.map(function(t){return t.resetActionErrors()})}},{key:"submit",value:function(){if(this.loading)return this.loading;if(!this.submitAction)return null;var t=this.submitAction(this.formData);if(!t instanceof Promise)throw new Error(p.notPromiseSubmitAction);return this.loading=this._processSubmitAction(t),this.loading}},{key:"_processSubmitAction",value:function(t){var e=this;return t.then(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,u.runInAction)(function(){e.response=t,e.fieldList.map(function(t){return t.resetInitialValue()}),e.resetActionErrors()})}).catch(function(t){if((0,u.runInAction)(function(){e.response={}}),t instanceof Error)throw t;if(!(t instanceof Array))throw new Error(p.notArrayActionErrors);e._setAactionErrors(t)})}},{key:"toJS",value:function(){var t=this.fieldList.map(function(t){return t.toJS()});return{actionErrors:(0,u.toJS)(this._actionErrors),response:(0,u.toJS)(this.response),fields:(0,d.mapValues)(t,"name")}}},{key:"valid",get:function(){return this.fieldList.every(function(t){return t.valid})}},{key:"dirty",get:function(){return this.fieldList.some(function(t){return t.dirty})}},{key:"isSubmitted",get:function(){return Boolean(this.response)}},{key:"errors",get:function(){return(0,d.mapValues)(this.fieldList,"name","errors")}},{key:"actionErrors",get:function(){return this._actionErrors}},{key:"formData",get:function(){return(0,d.mapValues)(this.fieldList,"name","value")}},{key:"fieldList",get:function(){return Object.values(this.fields)}},{key:"progress",get:function(){return this.isSubmitted?f.progressEnum.DONE:this.loading?f.progressEnum.IN_PROGRESS:this.actionErrors.length>0?f.progressEnum.ERROR:f.progressEnum.NONE}}]),t}(),n(a.prototype,"valid",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"valid"),a.prototype),n(a.prototype,"dirty",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"dirty"),a.prototype),n(a.prototype,"isSubmitted",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"isSubmitted"),a.prototype),n(a.prototype,"errors",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"errors"),a.prototype),n(a.prototype,"actionErrors",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"actionErrors"),a.prototype),n(a.prototype,"formData",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"formData"),a.prototype),n(a.prototype,"fieldList",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"fieldList"),a.prototype),n(a.prototype,"progress",[u.computed],Object.getOwnPropertyDescriptor(a.prototype,"progress"),a.prototype),n(a.prototype,"_setAactionErrors",[u.action],Object.getOwnPropertyDescriptor(a.prototype,"_setAactionErrors"),a.prototype),n(a.prototype,"reset",[u.action],Object.getOwnPropertyDescriptor(a.prototype,"reset"),a.prototype),n(a.prototype,"resetActionErrors",[u.action],Object.getOwnPropertyDescriptor(a.prototype,"resetActionErrors"),a.prototype),n(a.prototype,"submit",[u.action],Object.getOwnPropertyDescriptor(a.prototype,"submit"),a.prototype),a)},function(t,e){t.exports=require("mobx")},function(t,e,r){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,r,o,i){var n={};return Object.keys(o).forEach(function(t){n[t]=o[t]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,o){return o(t,e,r)||r},n),i&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(i):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(t,e,n),n=null),n}Object.defineProperty(e,"__esModule",{value:!0}),e.FormFieldStore=void 0;var n,a=function(){function t(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}}(),s=r(2);e.FormFieldStore=(n=function(){function t(e){var r=e.name,i=e.value,n=e.initialValue,a=void 0===n?i:n,u=e.actionErrors,c=e.validators,l=e.validatorFunctions;o(this,t),this._validatorFunctions=l;var p={name:r,validators:c,initialValue:a||null,value:i||null,_actionErrors:u};(0,s.extendObservable)(this,p)}return a(t,[{key:"reset",value:function(){this.resetActionErrors(),this.value=this.initialValue}},{key:"resetActionErrors",value:function(){this._actionErrors=[]}},{key:"resetInitialValue",value:function(){this.initialValue=this.value}},{key:"addAactionError",value:function(t){this._actionErrors.push(t)}},{key:"toJS",value:function(){return{actionErrors:(0,s.toJS)(this.actionErrors),initialValue:this.dirty?this.initialValue:void 0,name:this.name,value:this.value,validators:(0,s.toJS)(this.validators)}}},{key:"valid",get:function(){return this.errors.length<=0&&this._actionErrors.length<=0}},{key:"errors",get:function(){var t=this;return Object.keys(this.validators).filter(function(e){var r=t.validators[e];return"boolean"==typeof r?r&&!t._validatorFunctions[e](t):!t._validatorFunctions[e](t,r)})}},{key:"actionErrors",get:function(){return this._actionErrors}},{key:"dirty",get:function(){return this.initialValue!==this.value}}]),t}(),i(n.prototype,"valid",[s.computed],Object.getOwnPropertyDescriptor(n.prototype,"valid"),n.prototype),i(n.prototype,"errors",[s.computed],Object.getOwnPropertyDescriptor(n.prototype,"errors"),n.prototype),i(n.prototype,"actionErrors",[s.computed],Object.getOwnPropertyDescriptor(n.prototype,"actionErrors"),n.prototype),i(n.prototype,"dirty",[s.computed],Object.getOwnPropertyDescriptor(n.prototype,"dirty"),n.prototype),i(n.prototype,"reset",[s.action],Object.getOwnPropertyDescriptor(n.prototype,"reset"),n.prototype),i(n.prototype,"resetActionErrors",[s.action],Object.getOwnPropertyDescriptor(n.prototype,"resetActionErrors"),n.prototype),i(n.prototype,"resetInitialValue",[s.action],Object.getOwnPropertyDescriptor(n.prototype,"resetInitialValue"),n.prototype),i(n.prototype,"addAactionError",[s.action],Object.getOwnPropertyDescriptor(n.prototype,"addAactionError"),n.prototype),n)},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r="[mobx-form-store]",o="https://example.com";e.missingSubmitAction=r+" submitAction method is not defined or not a function. This method allows you to call submit() on the form. Read through the documentation "+o+"/test for examles and information about this.",e.notPromiseSubmitAction=r+" submitAction has to be a promise. Read through the documentation "+o+"/test for examles and information about this.",e.notArrayActionErrors=r+" action errors rejected from submitAction need to be in an array. Read through the documentation "+o+"/test for examles and information about this."},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.progressEnum={NONE:"none",IN_PROGRESS:"inProgress",DONE:"done",ERROR:"error"}},function(t,e){"use strict";function r(t,e,r){var o={};return t.forEach(function(t){o[t[e]]=r?t[r]:t}),o}function o(){}Object.defineProperty(e,"__esModule",{value:!0}),e.mapValues=r,e.noop=o},function(t,e){"use strict";function r(t){return Boolean(t.value)||0===t.value}function o(t,e){return!!t.value&&(t.value.length>=e||!t.value.length)}function i(t,e){return!!t.value&&t.value.length<=e}function n(t){return!t.value||s.test(t.value)}function a(t,e){return t.value===self[e].value}Object.defineProperty(e,"__esModule",{value:!0}),e.required=r,e.minLength=o,e.maxLength=i,e.email=n,e.equals=a;var s=/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/}]);