class GlobalVar {

    constructor(_name, _var) {
        this._name = _name
        this.create()
        this._setval(_var || this._getvar())
    }

    create() { 
        Object.defineProperty(this, 'value', {
            get: function () {
                var v = window.localStorage.getItem('_VHP_GOLBAL_' + this._name + '_') || '{"type":"_null"}'
                return deserialize(JSON.parse(v))
            },
            set: function (value) {
                var o = serialize(value)
                o = JSON.stringify(o)
                window.localStorage.setItem('_VHP_GOLBAL_' + this._name + '_', o)
            }
        })
    }

    init(){
        var that = this
        return function(arg){
            if(!arg){
                return that._getvar()
            }
            that._setval(arg)
        }
    }

    clear(){
        window.localStorage.removeItem('_VHP_GOLBAL_' + this._name + '_')
    }

    _getvar(){
        return this[this._name]
    }

    _setval(_var){
        this[this._name] = _var
    }

}

function serialize(obj) {
    return {
        type: '_' + Object.prototype.toString.call(obj).slice(8, -1).toLowerCase(),
        value: '' + obj
    }
}

function deserialize(op) {
    var cs = {
        _string: function (val) {
            return val
        },
        _number: function (val) {
            return +val
        },
        _boolean: function (val) {
            return val === 'true'
        },
        _undefined: function (val) {
            return undefined
        },
        _object: function (val) {
            return JSON.stringify(val)
        },
        _function: function (val) {
            return eval('(' + val + ')')
        },
        _array: function (val) {
            return JSON.stringify(val)
        },
        _date: function (val) {
            return new Date(val)
        },
        _regexp: function (val) {
            return new RegExp(val)
        },
        _null: function (val) {
            return null
        }
    }
    return cs[op.type](op.value)
}

export {GlobalVar}