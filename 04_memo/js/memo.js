"use strict";

window.addEventListener("DOMContentLoaded", function () {

    if (typeof localStorage === "undefined") {
        Swal.fire({
            icon: "error",
            title: "LocalStorage",
            text: "このブラウザはLocal Storage機能は実装されていません"
        });
        return;
    } else {
        saveLocalStorage();
        viewStorage();
        selectTable();
        delLocalStorage();
        delAllLocalStorage();
        delByEventDelegation();

        $("#table1").tablesorter({
            sortList: [[1, 0]]
        });
    }
});

function saveLocalStorage() {
    const save = document.getElementById("save");

    save.addEventListener("click", function (e) {
        e.preventDefault();

        const key = document.getElementById("textKey").value;
        const value = document.getElementById("textMemo").value;

        if (key === "" || value === "") {
            Swal.fire({
                icon: "error",
                title: "Memo app",
                html: "Key と Memo は必須です。"
            });
            return;
        }

        Swal.fire({
            title: "保存しますか？",
            html: `「${key} : ${value}」`,
            icon: "question",
            showCancelButton: true
        }).then((result) => {
            if (!result.value) return;

            localStorage.setItem(key, value);

            Swal.fire({
                icon: "success",
                title: "保存しました",
                html: `LocalStorage に 「${key} : ${value}」 を保存しました。`
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";

            viewStorage();
        });
    });
}

function viewStorage() {
    const list = document.getElementById("list");
    while (list.rows[0]) list.deleteRow(0);

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.innerHTML = "<input name='chkbox1' type='checkbox'>";

        const td2 = document.createElement("td");
        td2.textContent = key;

        const td3 = document.createElement("td");
        td3.textContent = value;

        const td4 = document.createElement("td");
        td4.innerHTML = "<img src='img/trash_icon.png' class='trash'>";

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        list.appendChild(tr);
    }

    $("#table1").trigger("update");
}

function selectCheckBox(mode) {
    const chk = document.getElementsByName("chkbox1");
    let count = 0;
    let index = -1;

    for (let i = 0; i < chk.length; i++) {
        if (chk[i].checked) {
            count++;
            index = i;
        }
    }

    if (mode === "select") {
        if (count === 1) return { ok: true, index };

        Swal.fire({
            icon: "error",
            title: "Memo app",
            html: "1つ選択してください。"
        });
        return { ok: false };
    }

    if (mode === "del") {
        if (count >= 1) return { ok: true, count };

        Swal.fire({
            icon: "error",
            title: "Memo app",
            html: "1つ以上選択してください。"
        });
        return { ok: false };
    }
}

function selectTable() {
    const select = document.getElementById("select");

    select.addEventListener("click", function () {
        const result = selectCheckBox("select");
        if (!result.ok) return;

        const table1 = document.getElementById("table1");
        const key = table1.rows[result.index + 1].cells[1].textContent;
        const value = table1.rows[result.index + 1].cells[2].textContent;

        document.getElementById("textKey").value = key;
        document.getElementById("textMemo").value = value;
    });
}

function delLocalStorage() {
    const del = document.getElementById("del");

    del.addEventListener("click", function (e) {
        e.preventDefault();

        const result = selectCheckBox("del");
        if (!result.ok) return;

        const count = result.count;

        Swal.fire({
            title: "削除しますか？",
            html: `選択されている ${count} 件を削除します。`,
            icon: "warning",
            showCancelButton: true
        }).then((res) => {
            if (!res.value) return;

            const chk = document.getElementsByName("chkbox1");
            const table1 = document.getElementById("table1");

            for (let i = chk.length - 1; i >= 0; i--) {
                if (chk[i].checked) {
                    const key = table1.rows[i + 1].cells[1].textContent;
                    localStorage.removeItem(key);
                }
            }

            viewStorage();

            Swal.fire({
                icon: "success",
                title: "削除しました",
                html: `${count} 件を削除しました。`
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
        });
    });
}

function delAllLocalStorage() {
    const delAll = document.getElementById("delAll");

    delAll.addEventListener("click", function (e) {
        e.preventDefault();

        if (localStorage.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Memo app",
                html: "削除するデータはありません。"
            });
            return;
        }

        Swal.fire({
            title: "すべて削除しますか？",
            html: "LocalStorage のデータをすべて削除します。",
            icon: "warning",
            showCancelButton: true
        }).then((result) => {
            if (!result.value) return;

            localStorage.clear();
            viewStorage();

            Swal.fire({
                icon: "success",
                title: "完了",
                html: "すべてのデータを削除しました。"
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
        });
    });
}

function delByEventDelegation() {
    const table1 = document.getElementById("table1");

    table1.addEventListener("click", function (e) {
        if (!e.target.classList.contains("trash")) return;

        const tr = e.target.closest("tr");
        const key = tr.cells[1].textContent;
        const value = tr.cells[2].textContent;

        Swal.fire({
            title: "削除しますか？",
            html: `「${key} : ${value}」を削除します。`,
            icon: "warning",
            showCancelButton: true
        }).then((result) => {
            if (!result.value) return;

            localStorage.removeItem(key);
            viewStorage();

            Swal.fire({
                icon: "success",
                title: "削除しました",
                html: `「${key} : ${value}」を削除しました。`
            });
        });
    });
}

