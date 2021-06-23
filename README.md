# lot_kiosk
웹앱으로 패스트푸드점의 무인 키오스크를 구현하는 프로젝트로,
[웹앱 키오스크 만들기 프로젝트](https://github.com/joons5834/lot_kiosk)의 fork입니다.

[여기](https://flask.palletsprojects.com/en/1.1.x/tutorial/layout/)에 나오는 리포지토리 구조를 모방하여 생성하였습니다.

## 프로젝트 구성과 기능
 * 고객주문모듈
   * 고객이 매장에서 주문할 때 사용하는 페이지입니다.
   * 장바구니에 주문들을 담은 뒤 결제하면 주문관리모듈에 주문 사항이 전달됩니다.
 * 주문관리모듈
   * 주방 등에서 주문내역을 확인할 때 사용하는 페이지입니다.
   * 주문 확인, 재고 관리, 조리완료 처리 기능 등이 있습니다.
 * 메뉴관리모듈
   * 메뉴의 추가, 삭제, 수정이 가능한 페이지입니다.
 * 판매관리모듈
   * 매출현황, 결제 이력 확인이 가능한 페이지입니다.

## 사용 기술
* `Flask`
* Vanilla JS
* `Socket.IO`
  * 주문 완료시 주방에 주문 내역 실시간 알림
  * 조리 완료시 홀에 실시간 알림

[//]: # (todo: write getting started for users)

## 키오스크 서버 설치하기 
### 요구 사항
1. 키오스크 서버 전용 파이썬 가상환경
   * `venv` 등을 이용해 구성
1. `sqlite3` 버전 `3.33.0` 이상
1. `pip` `9.0.0` 이상

### 서버 설치 요령
1. 요구 사항에 맞게 환경 구성
1. .whl 파일 [다운로드](https://www.mediafire.com/file/lmornoboce6rzzx/kiosk-1.0.0-py3-none-any.whl/file)
1. 전용 가상환경을 구동
1. `pip install 다운로드받은.whl파일경로`

[//]: # (todo: write getting started for users)


