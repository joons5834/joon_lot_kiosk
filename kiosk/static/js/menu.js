"use strict";
// '결제하기' 버튼
const to_charge = document.querySelector("#to_charge");
// Handle when category btn clicked
const charge_path = to_charge.dataset.path;
const category = document.querySelector(".category");
const menu_container = document.querySelector(".menu_container");
const menus = document.querySelectorAll(".menu");

const footer = document.querySelector(".list");
const basket = footer.querySelector(".basket");
const ul = basket.querySelector(".basket_items");

// 선택한 메뉴 정보를 담아 놓는 리스트
let itemsSelected = [];
// 세트 메뉴를 고를 경우, 옵션으로 선택한 디저트와 드링크 정보
let dessert_info = [];
let drink_info = [];
// 로컬스토리지에 저장할 때 사용하는 key값
const ITEM = "item";
const TOTAL = "total";

// Select the category and the default value
function categorySelect() {
	//카테고리 선택 안했을때 -> hamburger
	menus.forEach((menu) => {
		if (menu.dataset.type !== "hamburger") {
			// console.log(menu.dataset.type);
			menu.classList.add("invisible");
		}
	});

	//카테고리 선택시
	category.addEventListener("click", (event) => {
		const filter = event.target.dataset.filter;
		if (filter == null) {
			return;
		}

		//선택 카테고리 색상 변경
		const active = document.querySelector(".category_btn.selected");
		active.classList.remove("selected");
		event.target.classList.add("selected");

		//메뉴 선별
		menus.forEach((menu) => {
			if (filter === menu.dataset.type) {
				menu.classList.remove("invisible");
			} else {
				menu.classList.add("invisible");
			}
		});
	});
}

// 로컬 스토리지에 선택한 메뉴 정보 업로드
function saveItems() {
	localStorage.setItem(ITEM, JSON.stringify(itemsSelected));
	// 선택한 주문정보가 있다면 결제하기로 넘어갈 수 있음
	if (itemsSelected.length !== 0) {
		to_charge.setAttribute("onClick", `location.href='${charge_path}'`);
	}
}
// 총수량 & 결제예상금액 로컬스토리지에 저장
function saveTotal() {
	let total_amount = 0;
	itemsSelected.forEach(function (item) {
		total_amount = total_amount + item.amount;
	});
	// 결제예상금액 정보
	let total_price = 0;
	if (itemsSelected.length !== 0) {
		itemsSelected.forEach(function (each) {
			if (each.id === "set") {
				let set_price = each.price / each.amount;
				set_price =
					(set_price + each.dessert[1] + each.drink[1]) * each.amount;
				total_price = total_price + set_price;
			} else {
				total_price = total_price + each.price;
			}
		});
	}

	// 총 수량 및 금액 정보 로컬스토리지에 저장
	const totalObj = {
		amount: total_amount,
		price: total_price,
	};
	localStorage.setItem(TOTAL, JSON.stringify(totalObj));
}

// 세자리 마다 , 추가
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 메뉴가 선택됨에 따른 장바구니에 담긴 총 수량과 총 주문금액의 업데이트
function updateCheck() {
	const check_div = footer.querySelector(".check");

	const total_amount_h1 = check_div.querySelector(".check_num");
	const total_price_h1 = check_div.querySelector(".check_price");
	const totals = localStorage.getItem(TOTAL);
	if (totals !== null) {
		const parsedTotals = JSON.parse(totals);
		const amount_total = parsedTotals.amount;
		const price_total = numberWithCommas(parsedTotals.price);

		total_amount_h1.innerHTML = `${amount_total}`;
		total_price_h1.innerHTML = `${price_total} 원`;
	} else {
		total_amount_h1.innerHTML = "0";
		total_price_h1.innerHTML = "0";
	}
}

function deleteItem(event) {
	const btn = event.target;
	const btn_div = btn.parentNode;
	const wrapper = btn_div.parentNode;
	const li = wrapper.parentNode;
	// 화면에서 보여지는 삭제
	ul.removeChild(li);
	// 로컬스토리지에 저장된 정보 수정
	const delete_name = wrapper.querySelector(".item_name").querySelector("h3")
		.innerHTML;
	const delete_name_opts = wrapper
		.querySelector(".item_name")
		.querySelector("div").innerHTML;

	if (itemsSelected.length > 1) {
		const cleanItems = itemsSelected.filter(function (item) {
			if (item.id === "only") {
				return item.name !== delete_name;
			} else {
				// 세트메뉴는 이름만 가지고는 안 됨. name이 둘 다 치킨버거(세트)여도 옵션이 다르면 다른 주문이기 때문. 그래서 만약 둘 다 메뉴명이 같다면 옵션으로 비교를 해줘야 정확한 삭제가 가능.
				if (item.name === delete_name) {
					let opts = `${item.dessert[0]},${item.drink[0]}`;
					return opts !== delete_name_opts;
				}
				return item.name != delete_name;
			}
		});
		// itemsSelected 배열에서도 삭제한 메뉴 지워줌 -> 로컬스토리지에 저장
		itemsSelected = cleanItems;
		saveItems();
		// 로컬스토리지에 총수량/금액 정보 수정 -> html 상에서도 반영
		saveTotal();
		updateCheck();
	} else {
		itemsSelected = [];
		localStorage.clear();
		updateCheck();
		// 모두 삭제되고 선택된 주문 정보가 없다면 결제하기로 넘어갈 수 없음
		to_charge.removeAttribute("onClick");
	}
}

// 수량 옆에 삼각형 버튼 컨트롤
function changeAmount(event) {
	const btn = event.target;
	const btn_div = btn.parentNode;
	const amount_div = btn_div.parentNode;
	const amount_text = amount_div.querySelector("h3");
	const wrapper = amount_div.parentNode;
	const menu_name = wrapper.querySelector(".item_name").querySelector("h3")
		.innerHTML;
	const price_div = wrapper.querySelector(".item_price");
	const price_text = price_div.querySelector("h3");

	const btn_type = btn.getAttribute("class");
	if (btn_type === "item_numup") {
		itemsSelected.forEach(function (each) {
			if (each.name === menu_name) {
				let price_up = parseInt(price_text.innerHTML.replace(",", ""));
				// 세트메뉴라면
				if (each.id === "set") {
					price_up = price_up / each.amount + price_up;
				} else {
					price_up = each.price / each.amount + each.price;
				}
				// 로컬 스토리지 업데이트를 위해
				each.price = each.price / each.amount + each.price;
				each.amount = each.amount + 1;
				amount_text.innerHTML = `${each.amount}`;
				price_text.innerHTML = `${numberWithCommas(price_up)}`;
				saveItems();
				saveTotal();
				updateCheck();
			}
		});
	} else {
		itemsSelected.forEach(function (each) {
			// 담긴 수량이 하나라면 더이상 수량을 줄일 수 없음.
			if (each.amount > 1) {
				if (each.name === menu_name) {
					let price_down = parseInt(
						price_text.innerHTML.replace(",", "")
					);
					if (each.id === "set") {
						price_down = price_down - price_down / each.amount;
					} else {
						price_down = each.price - each.price / each.amount;
					}
					each.price = each.price - each.price / each.amount;
					each.amount = each.amount - 1;
					amount_text.innerHTML = `${each.amount}`;
					price_text.innerHTML = `${numberWithCommas(price_down)}`;
					saveItems();
					saveTotal();
					updateCheck();
				}
			}
		});
	}
}

// 세트모달창에서 '선택완료' 버튼을 누르면 일어나야 하는 일을 정의한 함수
function selectionDone() {
	const modal_menus = document.querySelectorAll(".menu_set");
	const dessert_btn = document.querySelectorAll(".modal_category_btn")[0];
	const drink_btn = document.querySelectorAll(".modal_category_btn")[1];
	// set_drink
	const filter = drink_btn.dataset.filter;
	const modal_question_set = document.querySelector(".modal_question.set");
	if (dessert_info.length === 4 && drink_info.length === 0) {
		modal_question_set.innerHTML = `
			세트드링크 1개를 선택해 주세요`;
		dessert_btn.classList.remove("selected");
		drink_btn.classList.add("selected");
		modal_menus.forEach((menu) => {
			if (filter === menu.dataset.type) {
				menu.classList.remove("invisible");
			} else {
				menu.classList.add("invisible");
			}
		});
	} else {
		modal_set.style.display = "none";
		addToCartSet();
		drink_btn.classList.remove("selected");
		dessert_btn.classList.add("selected");
		modal_menus.forEach((menu) => {
			if (menu.dataset.type === "set_dessert") {
				menu.classList.remove("invisible");
			} else {
				menu.classList.add("invisible");
			}
		});
	}
}

function drinkOption(d_name, d_price) {
	const modal_menus = document.querySelectorAll(".menu_set");
	const dessert_btn = document.querySelectorAll(".modal_category_btn")[0];
	const drink_btn = document.querySelectorAll(".modal_category_btn")[1];
	const modal_bottom_set = document.querySelector(".modal_bottom_set"),
		counts = modal_bottom_set.querySelectorAll(".many"),
		curr_count = counts[0].querySelectorAll("span")[1],
		remained_count = counts[1].querySelectorAll("span")[1],
		next_selection = modal_bottom_set.querySelectorAll("button")[1];
	const modal_set_btn_no = document.querySelector(".modal_set_btn.no");

	if (drink_info.length === 0 || drink_info.length === 2) {
		drink_info.push(d_name);
		drink_info.push(d_price);
		curr_count.innerHTML = "2";
		remained_count.innerHTML = "0";
	}
	// 드링크 옵션을 또 선택하면, 이전 선택정보는 사라짐.
	if (drink_info.length === 4) {
		drink_info.splice(0, 2);
	}
	// 취소하기 버튼 누르면 선택정보 삭제됨
	modal_set_btn_no.onclick = function () {
		modal_set.style.display = "none";
		dessert_info = [];
		drink_info = [];
		curr_count.innerHTML = "0";
		remained_count.innerHTML = "2";

		// 이후 다른 메뉴의 세트 모달을 띄웠을 때, 정상적으로 디저트 선택 모달부터 뜨도록
		drink_btn.classList.remove("selected");
		dessert_btn.classList.add("selected");
		modal_menus.forEach((menu) => {
			if ("set_dessert" === menu.dataset.type) {
				menu.classList.remove("invisible");
			} else {
				menu.classList.add("invisible");
			}
		});
		console.log(dessert_info, drink_info);
	};
	// addToCartSet()으로 넘어감
	if (drink_info.length === 2) {
		next_selection.addEventListener("click", selectionDone);
	}
}
// 디저트 옵션 중 1개 선택하면
function dessertOption(d_name, d_price, name, price) {
	const modal_bottom_set = document.querySelector(".modal_bottom_set"),
		counts = modal_bottom_set.querySelectorAll(".many"),
		curr_count = counts[0].querySelectorAll("span")[1],
		remained_count = counts[1].querySelectorAll("span")[1],
		next_selection = modal_bottom_set.querySelectorAll("button")[1];
	const modal_set_btn_no = document.querySelector(".modal_set_btn.no");

	if (dessert_info.length === 0 || dessert_info.length === 4) {
		dessert_info.push(d_name);
		dessert_info.push(d_price);
		dessert_info.push(name);
		dessert_info.push(price);
	}
	// 디저트 옵션을 또 선택하면, 이전 선택정보는 사라짐
	if (dessert_info.length === 8) {
		dessert_info.splice(0, 4);
	}
	// 취소하기 버튼 누르면 선택정보 삭제됨
	modal_set_btn_no.onclick = function () {
		modal_set.style.display = "none";
		dessert_info = [];
		curr_count.innerHTML = "0";
		remained_count.innerHTML = "2";
	};

	if (dessert_info.length === 4) {
		curr_count.innerHTML = "1";
		remained_count.innerHTML = "1";
		// 선택완료 버튼을 누르면 음료 선택 창으로 넘어감
		next_selection.addEventListener("click", selectionDone);
	}
}

//똑같은 메뉴를 이미 선택한 적 있는지 체크
function findSameItem(name, price, id) {
	let curr_amount = 1;
	let curr_price = parseInt(price);
	if (itemsSelected.length !== 0) {
		itemsSelected.forEach(function (each) {
			if (id === "only") {
				if (each.name === name) {
					curr_amount = curr_amount + each.amount;
					curr_price = curr_price + each.price;
					// itemsSelected 배열 정보 업데이트
					each.amount = curr_amount;
					each.price = curr_price;
				}
			}
		});
	}
	return [curr_amount, curr_price];
}

function addToHtml(name, curr_amount, curr_price) {
	// 버튼 클릭하면(메뉴 선택하면) li 태그 및 하위 여러 요소들 생성
	const li = document.createElement("li"),
		li_wrapper = document.createElement("div"),
		item_name = document.createElement("div"),
		item_name_h3 = document.createElement("h3"),
		item_name_opt = document.createElement("div"),
		item_amount = document.createElement("div"),
		amount_h3 = document.createElement("h3"),
		amount_div = document.createElement("div"),
		amount_up = document.createElement("button"),
		amount_down = document.createElement("button"),
		item_price = document.createElement("div"),
		price_h3 = document.createElement("h3"),
		del_btn = document.createElement("button");

	li_wrapper.classList.add("li_wrapper");
	item_name.classList.add("item_name");
	item_amount.classList.add("item_amount");
	item_price.classList.add("item_price");
	amount_up.classList.add("item_numup");
	amount_down.classList.add("item_numdown");

	// 단품인 경우 length === 1
	if (name.length === 1) {
		item_name_h3.innerHTML = `${name}`;
	} else {
		item_name_h3.innerHTML = `${name[0]}`;
		item_name_opt.innerHTML = `${name[1]}`;
	}
	amount_h3.innerText = `${curr_amount}`;
	price_h3.innerHTML = `${numberWithCommas(curr_price)}`;
	amount_up.innerHTML = "&xutri;";
	amount_up.setAttribute("onclick", "changeAmount(event)");
	amount_down.innerHTML = "&xdtri;";
	amount_down.setAttribute("onclick", "changeAmount(event)");
	del_btn.innerHTML = "삭제";
	// 삭제 버튼 누르면 아이템 삭제
	del_btn.setAttribute("onclick", "deleteItem(event)");

	item_name.appendChild(item_name_h3);
	item_name.appendChild(item_name_opt);
	amount_div.appendChild(amount_up);
	amount_div.appendChild(amount_down);
	item_amount.appendChild(amount_h3);
	item_amount.appendChild(amount_div);
	item_price.appendChild(price_h3);
	item_price.appendChild(del_btn);
	li_wrapper.appendChild(item_name);
	li_wrapper.appendChild(item_amount);
	li_wrapper.appendChild(item_price);
	li.appendChild(li_wrapper);
	ul.appendChild(li);
}

function addToCartSet() {
	const name = dessert_info[2];
	// options는 디저트와 드링크 옵션 선택정보
	const options = `${dessert_info[0]},${drink_info[0]}`;
	let curr_price = dessert_info[3];
	const id = "set";
	const curr_amount = 1;
	curr_price = curr_price + dessert_info[1] + drink_info[1];
	dessert_info.splice(2, 2);

	if (curr_amount === 1) {
		addToHtml([name, options], curr_amount, curr_price);
		const itemObj = {
			name: name,
			amount: curr_amount,
			price: curr_price - dessert_info[1] - drink_info[1],
			id: id,
			dessert: dessert_info,
			drink: drink_info,
		};
		itemsSelected.push(itemObj);
	}
	saveTotal();
	updateCheck();
	saveItems();
	dessert_info = [];
	drink_info = [];
}

function addToCart(name, price) {
	const id = "only";
	// 중복검사 -> 똑같은거 또 고르면 수량 +1, +가격 됨
	const result = findSameItem(name, price, id);
	const curr_amount = result[0];
	let curr_price = result[1];

	// 이번이 처음 선택하는 메뉴라면
	if (curr_amount === 1) {
		addToHtml([name], curr_amount, curr_price);
		const itemObj = {
			name: name,
			amount: curr_amount,
			price: curr_price,
			id: id,
		};
		itemsSelected.push(itemObj);
	}
	// 이미 한 번 이상 선택한 적이 있는 메뉴라면
	else {
		const lists = ul.querySelectorAll("li");
		for (const list of lists) {
			const amount_container = list.querySelector(".item_amount");
			const its_name = list
				.querySelector(".item_name")
				.querySelector("h3").innerHTML;
			const old_amount = amount_container.querySelector("h3");
			const price_container = list.querySelector(".item_price");
			const old_price = price_container.querySelector("h3");
			// 내가 수량을 바꿔야 할 li 태그가 맞는지 이름을 비교해서 확인
			if (its_name === name) {
				old_amount.innerHTML = `${curr_amount}`;
				old_price.innerHTML = `${numberWithCommas(curr_price)}`;
			}
		}
	}
	//메뉴를 선택하면 총 주문 내역 - 수량&결제예상금액 변경됨
	saveTotal();
	updateCheck();
	saveItems();
}

// 디저트/음료 선택 모달 디테일
function chooseModalCategory(name, price) {
	const modal_category = document.querySelector(".modal_category");
	const modal_menus = document.querySelectorAll(".menu_set");
	const modal_question_set = document.querySelector(".modal_question.set");
	const modal_set_btn_no = document.querySelector(".modal_set_btn.no");
	const modal_bottom_set = document.querySelector(".modal_bottom_set"),
		counts = modal_bottom_set.querySelectorAll(".many"),
		curr_count = counts[0].querySelectorAll("span")[1],
		remained_count = counts[1].querySelectorAll("span")[1];
	const dessert_btn = document.querySelectorAll(".modal_category_btn")[0];
	const drink_btn = document.querySelectorAll(".modal_category_btn")[1];
	// x버튼을 누르면 창 닫음
	modal_set_btn_no.onclick = function () {
		modal_set.style.display = "none";
	};
	// 디저트 메뉴버튼을 클릭하면 dessertOption()함수가 동작하도록, 드링크 메뉴버튼은 drinkOption()
	modal_menus.forEach((menu) => {
		if (menu.dataset.type !== "set_dessert") {
			menu.classList.add("invisible");
			const drink_name = menu.querySelector(".menu_drink_name").innerHTML;
			const drink_price = parseInt(
				menu.querySelector(".menu_drink_price").innerHTML
			);
			menu.addEventListener("click", (event) =>
				drinkOption(drink_name, drink_price)
			);
		} else {
			const dessert_name = menu
				.querySelector(".menu_dessert_name")
				.innerHTML.trim();
			const dessert_price = parseInt(
				menu.querySelector(".menu_dessert_price").innerHTML
			);
			menu.addEventListener("click", (event) =>
				dessertOption(dessert_name, dessert_price, name, price)
			);
		}
	});

	modal_question_set.innerHTML = "세트디저트 1개를 선택해 주세요";
	drink_btn.classList.remove("selected");
	dessert_btn.classList.add("selected");
	modal_menus.forEach((menu) => {
		if ("set_dessert" === menu.dataset.type) {
			menu.classList.remove("invisible");
		} else {
			menu.classList.add("invisible");
		}
	});

	// 드링크 옵션 선택 모달창에서 '세트_디저트' 탭 버튼을 누르면 디저트 옵션 선택 모달창으로 이동 + 디저트/드링크 선택정보 다 삭제됨 (처음부터 다시 선택)
	modal_category.addEventListener("click", (event) => {
		const filter = event.target.dataset.filter;
		if (filter == null) {
			return;
		}

		if (event.target.dataset.filter === "set_dessert") {
			modal_question_set.innerHTML = `
			세트디저트 1개를 선택해 주세요`;
			const filter = "set_dessert";

			drink_btn.classList.remove("selected");
			event.target.classList.add("selected");
			modal_menus.forEach((menu) => {
				if (filter === menu.dataset.type) {
					menu.classList.remove("invisible");
				} else {
					menu.classList.add("invisible");
				}
			});
			dessert_info = [];
			drink_info = [];
			curr_count.innerHTML = "0";
			remained_count.innerHTML = "2";
		}
	});
}

// 세트 메뉴 선택시, 디저트/음료 선택 모달
function getSetModal(name, price) {
	var modal_set = document.getElementById("modal_set");
	var close_set_btn = document.getElementsByClassName("modal_close_set")[0];

	modal_set.style.display = "block";
	chooseModalCategory(name, price);

	close_set_btn.onclick = function () {
		modal_set.style.display = "none";
		dessert_info = [];
		drink_info = [];
	};

	window.onclick = function (event) {
		if (event.target == modal_set) {
			modal_set.style.display = "none";
			dessert_info = [];
			drink_info = [];
		}
	};
}

// **추가. 햄버거 선택시 관련 정보 보여줌
function menuShowdata(name, img, menu_id) {
	const ad_container = document.querySelector(".ad");
	ad_container.innerHTML = `
	<div class="menu_data_container">
		<div class="menu_data_nav">
			<div class="select_lan">
				<span>한국어</span>
				<span>English</span>
				<span>中國語</span>
				<span>日本語</span>
			</div>
		</div>
        <div class="menu_data">
            <div class="menu_data_left">
                <img src="${img.src}" class="menu_data_img">
            </div>
            <div class="menu_data_right">
                <div class="menu_data_top">
                    <div class="menu_data_name">${name}</div>
                    <button class="menu_data_btn">영양성분</button>
                </div>
                <div class="menu_data_bottom">
                    <div class="menu_data_specific" id=desc_${menu_id}>메뉴 정보 추가할 곳</div>
                    <div class="menu_data_ingredient" id=ing_${menu_id}></div>
                </div>
            </div>
        </div>
    </div>
	`;
	
	const menu_data_bottom = document.querySelector(".menu_data_bottom");
	const menu_data_btn = document.querySelector(".menu_data_btn");
	// console.log(menu_data_btn);
	menu_data_btn.onclick = function () {
		menu_data_bottom.innerHTML = `
		<STYLE TYPE="text/css">table {font-size: 10pt;}</STYLE>
		<table border="1" bordercolor="black" width ="410" height="75" align = "center" >
    <tr align = "center">
		<td>원산지</td>
		<td colspan="5" id=allergy_${menu_id}>명태연육-미국산, 새우-베트남산</td>
    </tr>
    <tr>
		<td  align = "center">알러지</td>
		<td colspan="5" align = "center">밀,대두,난류,우유,토마토,새우</td>

    </tr>
    <tr align = "center">
		<td>총중량g</td>
		<td>열량Kcal</td>
		<td>단백질g(%)</td>
		<td>나트륨mg(%)</td>
		<td>당류g</td>
		<td>포화지방g(%)</td>
    </tr>
    <tr align = "center" id=row_${menu_id}>
		<td>179</td>
		<td>492</td>
		<td>15 (27)</td>
		<td>810 (40)</td>
		<td>7</td>
		<td>4.7 (31)</td>
	</tr>
</table>
		`;
	};
	const fetch_info_path = ad_container.getAttribute("data-path_info");
	let desc = document.getElementById(`desc_${menu_id}`);
	let ing_img = document.getElementById(`ing_${menu_id}`);
	let row = document.getElementById(`row_${menu_id}`);
	$.ajax({
		type: 'POST',
		url: fetch_info_path,
		data: JSON.stringify(menu_id),
		dataType : 'JSON',
		contentType: "application/json",
		success: function(data){
			// alert('성공! 데이터 값');
			console.log(data);
			let desc_info = data['desc'][0]['DESC'];
			desc.innerHTML = desc_info;
			$.each(data.ingredients, function(key,value){
				// alert(key + " : " + value)
				// $('#div2').append('<div>'+ value.id + " " + value.password + " " + value.email  +'</div>')
				// desc.innerHTML = 
			})
			
		},
		error: function(request, status, error){
			alert('ajax 통신 실패')
			alert(error);
		}
	})
	
}

// 모달
function getModal(name, price) {
	// Get the modal
	var modal = document.getElementById("myModal");
	var close_btn = document.getElementsByClassName("modal_close")[0];

	var modal_bottom = modal.querySelector(".modal_bottom");
	// 단품버튼, 세트버튼
	const only_btn = modal_bottom.querySelector(".burger_btn.only");
	const set_btn = modal_bottom.querySelector(".burger_btn.set");

	const modal_price_only = modal.querySelector(".burger_price.only");
	const modal_price_set = modal.querySelector(".burger_price.set");
	//세트 가격은 임의로 단품 가격 + 2000으로 했습니다...
	const set_price = parseInt(price) + 2000;

	// 메뉴를 클릭하면 모달창 띄움
	modal.style.display = "block";
	// 모달 창에서 단품, 세트 가격 표시
	modal_price_only.innerHTML = `${price}`;
	modal_price_set.innerHTML = `${set_price}`;

	// 단품/세트 버튼 클릭 시
	only_btn.onclick = function () {
		modal.style.display = "none";
		addToCart(name, price);
	};
	set_btn.onclick = function () {
		name = name + "(세트)";
		modal.style.display = "none";
		getSetModal(name, set_price);
	};

	// When the user clicks on <span> (x), close the modal
	close_btn.onclick = function () {
		// 닫음 버튼을 누르면 아무 것도 선택하지 않고 메뉴만 보여줌.
		modal.style.display = "none";
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			// 모달을 닫으면 아무 것도 선택하지 않고 메뉴만 보여줌.
			modal.style.display = "none";
		}
	};
}

function getValueFromBtn(menu) {
	menu.addEventListener("click", function (event) {
		const div_inside_menu = menu.querySelector("div");
		const price = div_inside_menu.querySelector(".menu_price").innerHTML;
		const name = div_inside_menu.querySelector(".menu_name").innerHTML;
		const img = menu.querySelector("img");
		const menu_id = menu.getAttribute("data-id");
		let id = "only";

		// 햄버거 메뉴만 클릭했을  모달 창이 뜨도록
		if (menu.dataset.type === "hamburger") {
			getModal(name, price);
			menuShowdata(name, img, menu_id);
		} else {
			addToCart(name, price, menu_id);
			menuShowdata(name, img, menu_id);
		}
	});
}
// 결제 모듈에서 '이전'이나 '추가주문' 버튼을 눌러서 장바구니 선택 모듈로 돌아왔을 때
function existingCart() {
	const existing = localStorage.getItem("item");
	if (existing !== null) {
		const parsedExisting = JSON.parse(existing);
		parsedExisting.forEach(function (parse) {
			const parse_name = parse.name;
			const parse_amt = parse.amount;
			const parse_prc = parse.price;
			if (parse.id === "set") {
				const parse_opt = `${parse.dessert[0]},${parse.drink[0]}`;
				addToHtml([parse_name, parse_opt], parse_amt, parse_prc);
			} else {
				addToHtml([parse_name], parse_amt, parse_prc);
			}
		});
		itemsSelected = parsedExisting;
		updateCheck();
		// 선택한 주문정보가 있다면 결제하기로 넘어갈 수 있음
		if (itemsSelected.length !== 0) {
			to_charge.setAttribute("onClick", `location.href='${charge_path}'`);
		}
	}
}

//타임아웃용 변수
let timer_id = null;
// init()을 제외한 아래 세 개의 함수는 다음의 동작을 위한 것
// 3분 간 아무런 동작이 없으며 홈화면으로 돌아감. 대신, 클릭 이벤트가 일어나면 기존의 타이머는 멈추고 클릭 이벤트 이후 새로운 타이머 작동
function startTimer() {
	timer_id = setTimeout("load('/order')", 10000);
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
	// 화면을 클릭하게 되면 타이머 멈춤
	container.setAttribute("onClick", "cancleTimer()");
	startTimer();
	existingCart();
	categorySelect();
	for (const menu of menus) {
		menu.addEventListener("click", getValueFromBtn(menu));
	}
}
init();
