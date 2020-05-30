const bindr = {
    bindVars: [],

    addBinding: (bVariableName, bFunction) => {
        if (bVariableName && bFunction) {

            bindr.bindVars.push(bVariableName);

            bindr[bVariableName] = {}
            
            bindr[bVariableName].bind = (val) => {
                bindr[bVariableName].val=val;
                bFunction(val)
            }
        }
    },

    refresh: () => {
        bindr.bindVars.forEach(bindVar => bindr[bindVar].bind(bindr[bindVar].val))
    }
}