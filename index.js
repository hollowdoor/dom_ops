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
        var p;
        if(node.parentNode !== this.root){
            node = node.parentNode;
            while(p = node.parentNode){
                if(p === this.root){
                    break;
                }
                node = p;
            }
        }

        for(var i=0; i<this.children.length; i++){
            if(this.children[i] === node){
                return i;
            }
        }

        return null;
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
