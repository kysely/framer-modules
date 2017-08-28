const matchPrimitive = (primitive, sQuery) => sQuery.test(primitive.toString())

const matchObject = (object, sQuery) => {
    let result = false

    Object.keys(object).forEach(key => {
        if ( result === true ) return
        if ( matchElement(object[key], sQuery) ) result = true
    })

    return result
}

const matchElement = (element, sQuery) => {
    switch (typeof element) {
    case 'string':
    case 'number':
        return matchPrimitive(element, sQuery)
    case 'object':
        return matchObject(element, sQuery)
    }
}

const filter = (list = [], query = '') => {
    if ( !Array.isArray(list) ) throw Error('The first parameter is not an Array')
    if ( query.length === 0 ) return list

    const searchQuery = new RegExp(`${query}`, 'i')
    const resultObjects = []

    list.forEach(item => {
        if ( matchElement(item, searchQuery) ) {
            resultObjects.push(item)
        }
    })

    return resultObjects
}

export default filter
