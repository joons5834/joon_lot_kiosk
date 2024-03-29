"use strict";

const form=document.manage_menu;
form.addEventListener('submit', function(e){
    const name=form.name.value;
    const submit_btn = document.querySelector('.submit_btn');
    if (confirm(`${name}를(을) ${submit_btn.value}하시겠습니까?`) == true){
        form.submit();
    }else{
        e.preventDefault();
        alert(`${name} ${submit_btn.value} 취소되었습니다.`)
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

function fillFormWithDetail(data){
    const file_input = document.getElementById('image');
    for(let [key, value] of Object.entries(data['menu_detail'])){
        const item = document.getElementById(key.toLowerCase())
        if (item) {
            if (key === 'IMAGE_PATH') {
                item.setAttribute('src', value)
                item.dataset.original = value
                clearInputFile(file_input);
            } else{
                item.value = value;
            }
        }
    }
    document.getElementById('category').value = data['categories']
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
          const inputs = document.getElementsByTagName('input');
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
              for (const input of inputs){
                input.readOnly = false;
              }
          }
          else if(filter === "change"){
              submit_btn.value = "수정";
              for (const input of inputs){
                input.readOnly = false;
              }
          } 
          else{
            //   submit_btn_container.innerHTML=`
            //   <button class="submit_btn return">취소</button>
            //   <input type="submit" value="삭제" class="submit_btn remove">
            //   `;
              submit_btn.value = "삭제";
              for (const input of inputs){
                  input.readOnly = true;
              }
          }
          form.action = action;
        })

}



//이미지 첨부시 보여주기 (다시 다른걸 선택할 경우 문제 발생)
function setThumbnail(event) { 
    const img = document.getElementById('image_path');
    if (event.target.files.length == 0){
        img.setAttribute("src", img.dataset.original);
    }
    for (var image of event.target.files) { 
        var reader = new FileReader(); 
        reader.onload = function(event) { 
            img.setAttribute("src", event.target.result); 
        };

        console.log(image); 
        reader.readAsDataURL(image); 
        } 
    }

function clearInputFile(f){
    if(f.value){
        try{
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        }catch(err){ }
        if(f.value){ //for IE5 ~ IE10
            var form = document.createElement('form'),
                parentNode = f.parentNode, ref = f.nextSibling;
            form.appendChild(f);
            form.reset();
            parentNode.insertBefore(f,ref);
        }
    }
}
categorySelect();
showMenuDetail();
addMenubtn();


