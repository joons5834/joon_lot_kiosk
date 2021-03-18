function appendToList(list, value){
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(value));
    li.setAttribute("id", value);
    list.appendChild(li);
}
const socket = io();
socket.on( 'order complete', function( order_id ) {
        console.log( order_id );
        const ul = document.getElementById("cooking");
        appendToList(ul, order_id)
      })

socket.on( 'cooking complete', function( order_id ) {
console.log( order_id );
const cooking_ls = document.getElementById("cooking");       
const ul = document.getElementById("done");
cooking = document.getElementById(order_id)
done = null;
if (cooking)
    ul.appendChild(cooking_ls.removeChild(cooking))
else{
    appendToList(ul, order_id)
}
})