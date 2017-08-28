const textLimit = (text, limit) => {
    if (text.length <= limit) return text

    return `${text.slice(0, limit)}…`
}

export default textLimit
