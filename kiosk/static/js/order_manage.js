"use strict";
var socket = io();
socket.on( 'order complete', function( order_id ) {
        console.log( order_id );
		location.reload();
      })
// function clickCallbtn(){
    // const call_btn = document.querySelector(".call_btn");
    // const order_container_special = document.querySelector(".order_container.special");
    // call_btn.onclick = function(){
        // //호출 버튼 클릭시 내용삭제, 회색배경으로 만들려고 하는데 
        // //클릭된 btn의 상위 class, 즉 .order_container.special
        // //을 order_container로 바꿔야 함. 

        // order_container_special.innerHTML = `
            // <div class="container_top"></div>
            // <div class="container_mid">
                // <div class="order_num"></div>
                // <div class="order_time"></div>
                // <div></div>
            // </div>
            // <div class="container_menu"></div>
            // <div class="container_bottom"></div>
        // `;
    // }
// }

// clickCallbtn();