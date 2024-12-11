import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

import { updateTitle } from "./assets/js/title";

if (getCookie("login")===""){
    redirect("/login");
}

getJSON("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/data/user","login",getCookie("login"),getUser)

function getUser(result) {
    if (result.status === 200) { // Status 200 berarti data ditemukan
        const name = result.data.name || "Guest"; // Default jika name tidak ditemukan
        setInner("name", name); // Menggunakan ID 'name' sesuai struktur HTML
        updateTitle(name); // Mengubah judul halaman
    } else if (result.status === 404) {
        console.warn("Data pengguna tidak ditemukan.");
        setInner("name", "Guest"); // Menampilkan nama default
    } else {
        console.error("Terjadi kesalahan saat mengambil data pengguna.");
    }

    console.log(result);
}
