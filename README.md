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

## 키오스크 서버 설치하기
### 요구 사항
1. 키오스크 서버 전용 파이썬 가상환경
    * `venv` 등을 이용해 구성
1. `sqlite3` 버전 `3.33.0` 이상
    * 가상 환경의 Python shell에서 `import sqlite3; sqlite3.sqlite_version`을 입력하면 나오는 문자열을 확인합니다.
1. `pip` `9.0.0` 이상

### 서버 설치 요령
1. 요구 사항에 맞게 환경 구성
1. .whl 파일 [다운로드](https://www.mediafire.com/file/lmornoboce6rzzx/kiosk-1.0.0-py3-none-any.whl/file)
1. 전용 가상환경을 구동
1. `pip install 다운로드받은.whl파일경로`
1. `FLASK_APP` 환경변수를 `kiosk`로 지정한 후 `flask init-db` 실행하여 db 초기화
    * bash
         ```bash
        export FLASK_APP=flaskr 
        flask init-db
         ```
    * `venv`를 통해 가상환경을 생성한 경우 `path_to_venv/var/flaskr-instance`에 `kiosk.sqlite`이 생성된 것을 확인합니다.
1. `SECRET_KEY` 구성
    1. 랜덤 시크릿 키 생성
        ``` bash
        $ python -c 'import os; print(os.urandom(16))'
        b'_2#y2L"F2Q7z\n\xec]/'
        ```
    1. `venv`를 통해 가상환경을 생성한 경우 `venv/var/flaskr-instance/config.py` 파일을 생성하고 ***각자 생성한*** 랜덤 키를 추가
        ```python
        SECRET_KEY = b'_2#y2L"F2Q7z\n\xec]/' # Do not copy and paste this as-is! Use your own key!
        ```
1. 두 링크를 참고하여 선호하는 방식으로 배포합니다. 
    * [`Waitress`를 이용한 배포](https://flask.palletsprojects.com/en/2.0.x/tutorial/deploy/#run-with-a-production-server)
    * [self-hosted options](https://flask.palletsprojects.com/en/2.0.x/deploying/#self-hosted-options)

[//]: # (todo: write getting started for users)


