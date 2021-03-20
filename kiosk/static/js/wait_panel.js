function insertAtTop(list, value){
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(value));
    li.setAttribute("id", value);
    list.prepend(li);
}
const socket = io();
socket.on( 'order complete', function( order_id ) {
        console.log( order_id );
        const ul = document.getElementById("cooking");
     insertAtTop(ul, order_id)
      })

socket.on( 'cooking complete', function( order_id ) {
console.log( order_id );
const cooking_ls = document.getElementById("cooking");       
const ul = document.getElementById("done");
cooking = document.getElementById(order_id);
done = null;
if (cooking)
    ul.prepend(cooking_ls.removeChild(cooking))
else{
 insertAtTop(ul, order_id)
}
ul.removeChild(ul.lastChild)
})