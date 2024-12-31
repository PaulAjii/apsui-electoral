export const errorHandler = (err) => {
    const { response } = err
    if (response.status !== 500) {
        console.error('Error adding candidate...', response.data.message)
        throw response.data.message
    } else {
        console.error('Error adding candidate...', response.statusText)
        throw response.statusText
    }
}