"use strict";

const togo_btn = document.querySelector(".step1_icon_btn.togo");
const here_btn = document.querySelector(".step1_icon_btn.here");
const togo_img = document.querySelector(".step1_img.togo");
const here_img = document.querySelector(".step1_img.here");
const step1 = document.querySelector(".step1");
const step2 = document.querySelector(".step2");
const card_btn = document.querySelector(".step2_icon_btn.card");
const mobile_btn = document.querySelector(".step2_icon_btn.mobile");

const togo_path = togo_img.getAttribute("data-togo_path") // togo_img에 저장
const togo_check_path = togo_img.getAttribute("data-togo_check_path") // togo_img에 저장
const here_path = here_img.getAttribute("data-here_path") // here_img에 저장
const here_check_path = here_img.getAttribute("data-here_check_path") // here_img에 저장
const bill2_path = step2.getAttribute("data-bill2_path") //step2 div에 저장
const register_path = step2.getAttribute("data-register_path") //step2 div에 저장
// const order_num_path = step2.getAttribute("data-order_num_path");

//step2 선택 
function clickStep2(){
    step1.style.backgroundColor = "#e0e0e0"; 
    step1.style.color = "#757575"; 
    step2.style.backgroundColor = "#f44336";
    step2.style.color = "#ffffff";
    card_btn.style.opacity = 1;
    mobile_btn.style.opacity = 1;
    //카드 선택
    card_btn.onclick = function(){
        mobile_btn.style.opacity = 0.5;
        card_btn.style.opacity = 1;
        card_btn.style.backgroundColor = "#e0e0e0";
        mobile_btn.style.backgroundColor = "#ffffff";
        getModal();
    }
    //모바일 바코드 선택
    mobile_btn.onclick = function(){
        card_btn.style.opacity = 0.5;
        mobile_btn.style.opacity = 1;
        mobile_btn.style.backgroundColor = "#e0e0e0";
        card_btn.style.backgroundColor = "#ffffff";
    }
}

//step1 선택
function clickStep1(){
    //포장
    togo_btn.onclick = function(){
        //**아래 네개(img.src) 사진 경로 설정 필요
        togo_img.src = togo_check_path; // /kiosk/static/img/togo_check.png; 
        here_img.src = here_path; // /kiosk/static/img/here.png"; 
        togo_btn.style.opacity = 1;
        here_btn.style.opacity = 0.5;
        clickStep2();

    }
    //매장
    here_btn.onclick = function(){
        here_img.src = here_check_path; // "../img/here_check.png";
        togo_img.src = togo_path // "../img/togo.png";
        here_btn.style.opacity = 1;
        togo_btn.style.opacity = 0.5; 
        clickStep2();
    }
}

//카드결제 모달
function getModal(){
    var modal = document.getElementById('myModal'); 
    const content_top = document.querySelector('.content_top');
    const content_bottom = document.querySelector('.content_bottom');
    const discribe_1 = document.querySelector('.discribe_1');
    const discribe_2 = document.querySelector('.discribe_2');
    const cancle_btn = document.querySelector('.modal_cancle_btn');   
    const receipt_btn = document.querySelector('.receipt_btn');


    modal.style.display = "block";
    //1초 지나면 내용변경 + 취소btn 추가
    setTimeout(function() {
        discribe_1.innerHTML=`* 그림과 같이 카드를 넣어주세요`
        discribe_2.innerHTML=`(IC칩이 단말기에 투입되도록 넣어주세요)`;
        cancle_btn.style.display = "block";
    
        //영수증 발행 
        setTimeout(function() {
            //**<img src = ... > 1개 경로 설정 필요
            //** onlcilck 2개 경로설정 필요 (대기번호 화면 (/order_num)으로 넘어가는 경로)
            console.log('Works!');
            content_top.innerHTML = `영수증을 발행 하시겠습니까?`;
            content_bottom.innerHTML = `
            <div class="receipt_top">
                <div class="receipt_left">
                    <img src = "${bill2_path}" class="receipt_img">
                </div>
                <div class = "receipt_right">
                    <div class="discribe">
                        <div><span>결제영수증</span>이 필요하신</div>
                        <div>고객께서는 <span>발행버튼을<span></div>
                        눌러주세요
                    </div>
                    <div class="discribe_little">미발행 선택 시 대기번호만 출력</div>
                </div>
            </div>
            <div class = "receipt_bottom">
                <button class="receipt_btn yes">발행</button>
                <button class="receipt_btn no">미발행</button>
            </div>
            `;
			const receipt_buttons = document.getElementsByClassName("receipt_btn");
			for (const btn of receipt_buttons){
				$( btn ).click(function(){
					let total = JSON.parse(localStorage.getItem('total'));
					let items = JSON.parse(localStorage.getItem('item'));
					
					let postdata = {
						'total':total, 'items':items
					}
					$.ajax({
						type: 'POST',
						url: register_path,
						data: JSON.stringify(postdata),
						dataType: 'html',
						contentType: "application/json",
						success: function(data){
							document.body.innerHTML = data;
						},
						error: function(request, status, error){
							alert('ajax 통신 실패')
							alert(error);
						}
					})
				})
			}
				
          }, 2000);
      }, 2000);

    //카드 취소 버튼 클릭시 모달 종료
    cancle_btn.onclick = function(){
    modal.style.display = "none"};


    //배경화면 클릭시 모달 종료
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// 취소하기 버튼 누르면 장바구니 내역 초기화
function handleCancleBtn() {
	const btns = document.querySelector(".btns");
	const order_cancle_btn = btns.querySelector(".order_cancle_btn");
	order_cancle_btn.addEventListener("click", function () {
		localStorage.clear();
	});
}

// 왼쪽 삼각형 버튼
function leftBtn() {
	const bag_btn = document.querySelector(".bag_btn");
	const tri_left = bag_btn.querySelector(".left");
	tri_left.addEventListener("click", function () {
		const bag = document.querySelector(".bag");
		const uls = bag.querySelectorAll(".bag_lists");
		if (uls.length === 1) {
			return;
		} else {
			const uls_len = uls.length;
			for (let i = uls_len - 1; i > -1; i--) {
				let ul_class = uls[i].className;
				if (ul_class.indexOf("invisible") === -1) {
					if (i === 0) {
						break;
					} else {
						uls[i].classList.add("invisible");
						uls[i - 1].classList.remove("invisible");
						break;
					}
				}
			}
		}
	});
}

// 오른쪽 삼각형 버튼
function rightBtn() {
	const bag_btn = document.querySelector(".bag_btn");
	const tri_right = bag_btn.querySelector(".right");
	tri_right.addEventListener("click", function () {
		const bag = document.querySelector(".bag");
		const uls = bag.querySelectorAll(".bag_lists");
		if (uls.length === 1) {
			return;
		} else {
			const uls_len = uls.length;
			for (let i = 0; i < uls_len; i++) {
				let ul_class = uls[i].className;
				if (ul_class.indexOf("invisible") === -1) {
					if (i === uls_len - 1) {
						break;
					} else {
						uls[i].classList.add("invisible");
						uls[i + 1].classList.remove("invisible");
						break;
					}
				}
			}
		}
	});
}

// 세자리 마다 , 추가
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function chargedPrice() {
	const charge_order = document.querySelector(".charge_order");
	const charge_original = charge_order.querySelector(".charge_original");
	const charge_money = charge_original.querySelector(".charge_money");
	const charge_last = document.querySelector(".charge_last");
	const charge_last_money = charge_last.querySelector(".charge_last_money");

	const total = localStorage.getItem("total");
	const parsedTotal = JSON.parse(total);
	charge_money.innerHTML = `${numberWithCommas(parsedTotal.price)}`;
	charge_last_money.innerHTML = `${numberWithCommas(parsedTotal.price)}`;
}

function addToHtml(name, amount, price) {
	const li = document.createElement("li"),
		list_wrapper = document.createElement("div"),
		list_name = document.createElement("div"),
		list_amount = document.createElement("div"),
		list_price = document.createElement("div");

	li.classList.add("bag_list");
	list_wrapper.classList.add("list_wrapper");
	list_name.classList.add("list_name");
	list_amount.classList.add("list_amount");
	list_price.classList.add("list_price");

	list_name.innerHTML = `${name}`;
	list_amount.innerHTML = `${amount}`;
	list_price.innerHTML = `${price}`;

	list_wrapper.appendChild(list_name);
	list_wrapper.appendChild(list_amount);
	list_wrapper.appendChild(list_price);
	li.appendChild(list_wrapper);

	return li;
}

// 새로운 ul 생성
function newUL() {
	const bag = document.querySelector(".bag");
	// 새로운 ul태그 생성
	const new_ul = document.createElement("ul");
	new_ul.classList.add("bag_lists");
	new_ul.classList.add("invisible");
	bag.appendChild(new_ul);
	return new_ul;
}

function makeList(item) {
	const uls = document.querySelectorAll(".bag_lists");
	const name = item.name;
	const amount = item.amount;
	const price = item.price;
	// 세트메뉴면 밑에 디저트랑 드링크 옵션내역도 표시해 줘야 함
	if (item.id === "set") {
		const dessert_n = "-" + item.dessert[0];
		const dessert_p = item.dessert[1];
		const drink_n = "-" + item.drink[0];
		const drink_p = item.drink[1];
		const main = addToHtml(name, amount, price);
		const dessert = addToHtml(dessert_n, amount, dessert_p * amount);
		const drink = addToHtml(drink_n, amount, drink_p * amount);

		// 아래 과정은 한 ul에서 li가 6개가 채워지면, 그 다음 생성되는 li부터는 새로운 ul을 만들어서 append
		//ul이 아직 하나만 있을 때
		if (uls.length === 1) {
			const lists = uls[0].querySelectorAll(".bag_list");
			// li 태그가 하나라도 있다면
			if (lists !== null) {
				if (lists.length < 4) {
					uls[0].appendChild(main);
					uls[0].appendChild(dessert);
					uls[0].appendChild(drink);
				} else {
					// 새로운 ul태그 생성
					const new_ul = newUL();
					if (lists.length === 4) {
						uls[0].appendChild(main);
						uls[0].appendChild(dessert);
						new_ul.appendChild(drink);
					} else {
						if (lists.length === 5) {
							uls[0].appendChild(main);
							new_ul.appendChild(dessert);
							new_ul.appendChild(drink);
						}
						new_ul.appendChild(main);
						new_ul.appendChild(dessert);
						new_ul.appendChild(drink);
					}
				}
			} else {
				uls[0].appendChild(main);
				uls[0].appendChild(dessert);
				uls[0].appendChild(drink);
			}
		} else {
			const last_li = uls[uls.length - 1];
			const lists = last_li.querySelectorAll(".bag_list");
			if (lists.length < 4) {
				last_li.appendChild(main);
				last_li.appendChild(dessert);
				last_li.appendChild(drink);
			} else {
				const new_ul = newUL();
				if (lists.length === 4) {
					last_li.appendChild(main);
					last_li.appendChild(dessert);
					new_ul.appendChild(drink);
				} else {
					if (lists.length === 5) {
						last_li.appendChild(main);
						new_ul.appendChild(dessert);
						new_ul.appendChild(drink);
					}
					new_ul.appendChild(main);
					new_ul.appendChild(dessert);
					new_ul.appendChild(drink);
				}
			}
		}
	}
	// 단품인 경우
	else {
		const main = addToHtml(name, amount, price);
		if (uls.length === 1) {
			const lists = uls[0].querySelectorAll(".bag_list");
			if (lists !== null && lists.length === 6) {
				const new_ul = newUL();
				new_ul.appendChild(main);
			} else {
				uls[0].appendChild(main);
			}
		} else {
			const last_li = uls[uls.length - 1];
			const lists = last_li.querySelectorAll(".bag_list");
			if (lists.length === 6) {
				const new_ul = newUL();
				new_ul.appendChild(main);
			} else {
				last_li.appendChild(main);
			}
		}
	}
}

function listsShowing() {
	const itemsSelected = localStorage.getItem("item");
	const parsedItemsSelected = JSON.parse(itemsSelected);
	parsedItemsSelected.forEach(function (item) {
		makeList(item);
	});
	const uls = document.querySelectorAll(".bag_lists");
	// 남은 부분은 빈 리스트로 채움
	uls.forEach(function (ul) {
		const lists = ul.querySelectorAll(".bag_list");
		for (let i = lists.length; i < 6; i++) {
			const blank = addToHtml("", "", "");
			ul.appendChild(blank);
		}
	});
	// 주문금액, 결제할 금액
	chargedPrice();
}

//타임아웃용 변수
let timer_id = null;
// 아래 세 개의 함수는 다음의 동작을 위한 것
// 3분 간 아무런 동작이 없으며 홈화면으로 돌아감. 대신, 클릭 이벤트가 일어나면 기존의 타이머는 멈추고 클릭 이벤트 이후 새로운 타이머 작동
function startTimer() {
	timer_id = setTimeout("alert('10초간 사용자 입력이 없어 홈페이지로 이동합니다.');load('/order');", 10000);
}
function cancleTimer() {
	if (timer_id !== null) {
		clearTimeout(timer_id);
		startTimer();
	}
}
function load(url) {
	window.location = url;
}

function init() {
	const container = document.querySelector(".container");
	// 화면을 클릭하면 타이머 멈춤
	container.setAttribute("onClick", "cancleTimer()");
	startTimer();
	listsShowing();
	rightBtn();
	leftBtn();
	handleCancleBtn();
	clickStep1();
}
init();


