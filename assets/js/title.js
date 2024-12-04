import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

import { conf } from "./url/config.js";

export function main(){
    getJSON(conf.user,"login",getCookie("login"), titleFunction)
    console.log(getCookie("login"));
    console.log(conf.user);
}

// ambil nama dan masukan ke title
function titleFunction(result){
    if (result.status !== 404){
        document.title = result.data.name;
    }
    else {
        setInner("content","Silahkan lakukan pendaftaran terlebih dahulu "+result.data.name);
        redirect("/login");
    }

}