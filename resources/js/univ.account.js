const univAccount = {
    /*
    snsType: FACEBOOK, NAVER, GOOGLE, KAKAO
    authGB: SIGN (가입인증), LOGIN (로그인)
    */
    authSNS: function (siteCode, snsType, authGB, returnUrl, isTest) {
        var domain = isTest ? "https://univaccount.dev01-tester.kr" : "https://univaccount.univ.me";
        var url = domain + "/Auth/SNSAuth?p=" + this.GetJsonToEncParam({
            SiteCode: siteCode,
            Type: snsType,
            AuthGB: authGB,
            ReturnUrl: returnUrl
        });

        location.href = url;
	},
    GetJsonToEncParam: function (paramJson) {
        var response = "";

        //json 을 parameter 만든다.
        var isFirst = true;
        $.each(paramJson, function (key, value) {
            if (value == undefined) { return; }

            var valueString = "";
            if (typeof value == 'object') {
                //name 으로 여러개 tag 값 가져올 때 구분자는 특수문자 , 임 (c# 단에서 split 할때 ， 이걸로 하세요)
                var objValue = value;
                var first = false;
                $.each(objValue, function (i, iValue) {
                    if (!first) {
                        valueString += iValue;
                        first = true;
                    } else {
                        valueString += "，" + iValue;
                    }
                });
            } else {
                valueString = value;
            }

            valueString = valueString.toString();
            valueString = valueString.replace(/&/g, "＆");
            valueString = valueString.replace(/=/gi, "＝");

            response += (isFirst ? "" : "&") + key + "=" + valueString;
            isFirst = false;
        });

        //파라미터를 base64 로 인코딩 한다.
        response = btoa(encodeURIComponent(response));

        //base64 값 중에 + 기호를 ~univ~ 로 치환한다.
        return response.replace(/[+]/gi, '~univ~');
    }
};