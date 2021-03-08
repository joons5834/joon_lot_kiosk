"use strict";

//TODO: handle submit_btn for add, change, delete
const form=document.manage_menu;
form.addEventListener('submit', function(e){
    const name=form.name.value;
    const submit_btn = document.querySelector('.submit_btn');
    if (confirm(`${name}를(을) ${submit_btn.value}하시겠습니까?`) == true){
        form.submit();
    }else{
        return;
    }
})



// 카테고리 btn 클릭
const categories = document.querySelector(".categories_btn");
const category = document.querySelector(".category");
const menu_container = document.querySelector(".menu_container");
const menus = document.querySelectorAll(".menu");


function categorySelect(){
    categories.addEventListener("click", (event)=>{
        const filter = event.target.dataset.filter;
        if (filter == null) {
            return;
        }

        if (document.querySelector(".category.selected") !==null){
            document.querySelector(".category.selected").classList.remove("selected");
        }
        event.target.classList.add("selected");
        
        menus.forEach((menu)=>{
            if (filter === menu.dataset.type ){
                menu.style.display = "flex";
            } else{
                menu.style.display = "none";
            }
        })
    })
}

function showMenuDetail(){
    menus.forEach((menu)=>{
        menu.addEventListener("click", (event)=>{
            const menu_id = event.currentTarget.dataset.id;
            console.log(menu_id)
            const fetch_info_path = categories.dataset.path;
            $.ajax({
                type: 'POST',
                url: fetch_info_path,
                data: JSON.stringify(menu_id),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
                    // alert('성공! 데이터 값');
                    console.log(data)
                    fillFormWithDetail(data);
                },
                error: function(request, status, error){
                    alert('ajax 통신 실패')
                    alert(error);
                }
            })
        })
    })
}

function fillFormWithDetail(data){ //TODO: fill image
    for(let [key, value] of Object.entries(data)){
        const item = document.getElementById(key.toLowerCase())
        if (item)
            item.value = value;
    }
}

//메뉴추가, 메뉴수정, 메뉴 삭제 버튼 클릭시 팝업창 내용 변경
const manage_btns = document.querySelector(".menu_manage_btn");
// const submit_btn = document.querySelector(".submit_btn");
const submit_btn_container = document.querySelector(".input_container_right");
function addMenubtn(){
    manage_btns.addEventListener('click', event => {
          const filter = event.target.dataset.filter;
          const action = event.target.dataset.path;
          const form = document.forms.manage_menu;
          const submit_btn = document.querySelector('.submit_btn');
          if (filter==null){
              return;
          }
          if(document.querySelector(".manage_btn.selected")!==null){
              document.querySelector(".manage_btn.selected").classList.remove("selected");
          }
          console.log(filter);
          
          event.target.classList.add("selected");
          if (filter==="add"){
              submit_btn.value = "추가";
          }
          else if(filter === "change"){
              submit_btn.value = "수정";
          } 
          else{
            //   submit_btn_container.innerHTML=`
            //   <button class="submit_btn return">취소</button>
            //   <input type="submit" value="삭제" class="submit_btn remove">
            //   `;
              submit_btn.value = "삭제";
          }
          form.action = action;
        })

}



//이미지 첨부시 보여주기 (다시 다른걸 선택할 경우 문제 발생)
function setThumbnail(event) { 
    for (var image of event.target.files) { 
        var reader = new FileReader(); 
        reader.onload = function(event) { 
            var img = document.createElement("img"); 
            img.setAttribute("src", event.target.result); 
            document.querySelector("div#image_container").appendChild(img); 
        };

        console.log(image); 
        reader.readAsDataURL(image); 
        } 
    }


categorySelect();
showMenuDetail();
addMenubtn();


