
	function GetGrades() {
		var id = document.getElementById("ysem").value;
		ShowAjaxLoadImage();
		Ajax.ajax({url : 'index.php?ajx=1&mod=grades&action=GetGrades&yt=' + id, method : 'POST', callback : cb_GetGrades });
	}

	function cb_GetGrades(res) {
		if(res.state == 4 && res.status == 200) {
			eval("var resAr = " + res.data);
			var cnt = document.getElementById("divShowStudGrades");
			cnt.style.display = 'block';
			HideAjaxLoadImage();
			if(resAr["CODE"] == 1) {
				cnt.innerHTML = resAr["DATA"];
			}
			else if(resAr["CODE"] < 0) {
				alert(resAr["DATA"]);
			}
		}
	}

	GetGrades();
