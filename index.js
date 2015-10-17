var domFrom = require('dom-from'),
    linkCSS = require('link-css');

function Ex(element, template){
    return new DomOps(element, template);
}

/*
git remote add origin https://github.com/hollowdoor/dom_ops.git
git push -u origin master
*/

function DomOps(element, template){
    this.root = element;
    this.recent = null;

    this.template = function(content){
        return content;
    };

    Object.defineProperty(this, 'children', {
        value: element.children
    });

    Object.defineProperty(this, 'classList', {
        value: element.classList
    });

    Object.defineProperty(this, 'style', {
        get: function(){
            return element.style;
        }
    });

    if(typeof template === 'function'){
        this.template = template;
        this.templateSet = true;
    }
}

DomOps.prototype = {
    constructor: DomOps,
    appendTo: function(parent){
        parent.appendChild(this.root);
        return this;
    },
    append: function(content, data){
        var c = this.template(content, data),
            dom = domFrom(c);
        this.root.appendChild(dom);
        this.recent = dom;
        return this;
    },
    prepend: function(content, data){
        var c = this.template(content, data),
            dom = domFrom(c);
        this.root.insertBefore(dom, this.root.firstChild);
        this.recent = dom;
        return this;
    },
    insert: function(content, index, data){
        var c = this.template(content, data),
            dom = domFrom(c);
        index = this._resolvePosition(index);
        if(index){
            this.root.insertBefore(dom, this.children[index]);
            this.recent = dom;
        }

        return this;
    },
    replace: function(content, index, data){
        var c = this._template(content, data),
            dom = domFrom(c);
        index = this._resolvePosition(index);
        if(index){
            this.root.removeChild(this.children[index]);
            this.root.insertBefore(dom, this.children[index + 1]);
            this.recent = dom;
        }
        return this;
    },
    remove: function(index){
        var result = null;
        if(isNaN(index) && !isNaN(index.nodeType)){
            result = index;
        }
        index = this._resolvePosition(index);
        if(!result)
            return this.root.removeChild(this.children[index]);
        this.root.removeChild(this.children[index]);
        return result;
    },
    _resolvePosition: function(index){
        if(!isNaN(index))
            return this._resolveIndex(index);
        return this._indexOf(index);
    },
    _resolveIndex: function(index){
        if(index > this.length - 1)
            return null;
        else if(index < 0)
            if(index * -1 < this.length - 1)
                return null;
            else if(index * -1 < this.length - 1)
                return (this.length + index) * -1;
        return index;
    },
    indexOf: function(node){
        var p, parts, i;
        if(node.parentNode){
            if(node.parentNode !== this.root){
                while(node && (p = node.parentNode)){
                    if(p === this.root)
                        break;
                    node = p;
                }
            }

            if(!node)
                return null;

            for(i=0; i<this.children.length; i++){
                if(this.children[i] === node){
                    return i;
                }
            }

            return null;
        }else{
            node = node + '';
            for(i=0; i<this.children.length; i++){
                if(node === this.children[i].outerHTML)
                    return i;
                parts = this.children[i].outerHTML.split(node);
                if(parts.length > 1)
                    return i;
            }
        }

        return null;

    },
    match: function(pattern, op){
        var list = [], i, j, propRegex, prop, found = false;
        if(!op){
            for(i=0; i<this.children.length; i++){
                if(pattern.test(this.children[i].textContent)){
                    c = this.children[i].getElementsByTagName('*');
                    if(c.length){
                        for(j=0; j<c.length; j++){
                            if(pattern.test(c[j].textContent)){
                                list.push(c[j]);
                                found = true;
                            }
                        }

                        if(!found)
                            list.push(this.children[i]);
                    }else{
                        list.push(this.children[i]);
                    }
                    found = false;
                }
            }
            return list;
        }else if(op instanceof RegExp){
            if(typeof pattern !== 'string') return list;
            prop = pattern;
            propRegex = new RegExp('('+escapeRegExp(pattern)+')="([^"]+)"');
            pattern = op;
            for(i=0; i<this.children.length; i++){
                if((m = this.children[i].outerHTML.match(propRegex))){
                    if(this.children[i].hasAttribute(prop)){
                        if(pattern.test(this.children[i].getAttribute(prop))){
                            list.push(this.children[i]);
                        }

                    }else{
                        c = this.children[i].getElementsByTagName('*');
                        for(j=0; j<c.length; j++){
                            if(c[j].hasAttribute(prop)){
                                if(pattern.test(c[j].getAttribute(prop))){
                                    list.push(c[j]);
                                }
                            }
                        }
                    }
                }

            }
            return list;
        }

    },
    html: function(str){
        if(str === undefined)
            return this.root.innerHTML;
        this.root.innerHTML = str;
    },
    get: function(index){
        index = this._resolveIndex(index);
        return this.children[index];
    }
};

Ex.domFrom = domFrom;
Ex.linkCSS = linkCSS;

module.exports = Ex;

//from
//http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
