export async function nigga() {
    const test = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    console.log(test)
    return test

}