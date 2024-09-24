const REG_EMAIL =
    /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME =
    /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;
const REG_PHONE = /^[0]\d{9,10}$/;

//Viết cho nó các hàm để cho từng nhu cầu chặn để sử dụng cấu trúc Observer Design Pattern
//Quy tắt của một hàm là nhận vào kiểm tra xem có đúng với yêu cầu không, nếu không đúng yêu cầu
//thì trả ra false còn đúng thì trả ra "", như vậy sẽ giống đồng nhất trong việc xài kiến trúc
/*
name: isRequired, isName
email: isRequired, isEmail
phone: isRequired, isPhone
message: isRequired, min(10), max(40)
*/

//isRequired(value)
//Hàm nhận vào value và kiểm tra xem có bỏ trống hay không?
//Nếu bỏ trống thì trả ra câu chửi còn valid thì trả ra ""
//Nhưng ngoài việc bỏ trống còn xét xem nó có là null không
//vì đối với những loại checkbox tick vào thì không tích là null và null cũng coi
//như là bỏ trống

//Tất cả các hàm đều viết theo cấu trúc để sử dụng kiến trúc observer design pattern

const isRequired = (value) => (value ? "" : "That field is required!");

//hàm kiểm tra xem name, email, phone có valid hay không theo regex
const isName = (value) => (REG_NAME.test(value) ? "" : "Name is invalid!");
const isEmail = (value) => (REG_EMAIL.test(value) ? "" : "Email is invalid!");
const isPhone = (value) => (REG_PHONE.test(value) ? "" : "Phone is invalid!");

//hàm min max kiểm tra xem độ dài có thỏa với numberBound không
const min = (numberBound) => (value) => (value.length >= numberBound ? "" : `Min is ${numberBound}!`);
const max = (numberBound) => (value) => (value.length <= numberBound ? "" : `Max is ${numberBound}!`);

//viết thử một object gồm 4 thuộc tính, 2 thuộc tính dùng để check lỗi, 2 cái dùng để hiển thị lỗi
//dom thử
// let nameNode = document.querySelector("#name");

/*
    value: nameNode.value               /lấy ra value để chạy mảng các hàm check
    funcs: [isRequired, isName]         /mảng lưu các hàm dùng để kiểm tra value có valid không
    parentNode: nameNode.parentElement  /nếu có lỗi nhìn lên cha để nhét thông báo lỗi vào
    controlNodes: [nameNode]            /duyệt qua các chỗ có ô input để thêm class cho nó đỏ lên
*/

//hàm tạo ra lỗi
const createMsg = (parentNode, controlNodes, msg) => {
    //tạo ra cái div giả 
    let invalidDiv = document.createElement("div");
    //nhét câu chửi vào div
    invalidDiv.textContent = msg;
    //thêm class báo đỏ cho câu chửi
    invalidDiv.classList.add("invalid-feedback");
    //nhét nó vào thằng cha
    parentNode.appendChild(invalidDiv);
    //thêm màu đỏ cho các ô input bị lỗi
    controlNodes.forEach((item) => {
        item.classList.add("is-invalid");
    });
};

//test thử
// let nameNode = document.querySelector("#name");
// createMsg(nameNode.parentElement, [nameNode], "ahihi");

//hàm isValid({}): nhận vào đầy đủ 4 thuộc tính của object dùng để
//kiểm tra thử xem là value có valid bằng funcs không. Nếu không valid
//thì hiện lỗi bằng parentNode và controlNodes. Lưu ý nếu có lỗi thì mình sẽ dừng
//hẳn luôn để không nó hiện nhiều quá. Và nếu lỗi thì trả ra cái lỗi đó, còn không lỗi
//thì mình trả ra "" cho nó => nhằm giúp mình check khi nào thì form valid toàn bộ

const isValid = ({value, funcs, parentNode, controlNodes}) => {
    //chạy qua các hàm coi có lỗi gì không
    //nhưng chạy for-of vì vậy mới dừng được
    for (const funcCheck of funcs) {
        let msg = funcCheck(value);
        if(msg){
            createMsg(parentNode, controlNodes, msg);
            return msg;
        };
    };
    //nếu cuối cùng không có lỗi thì trả cho ""
    return "";
};

//test thử
// let nameNode = document.querySelector("#name");
// isValid({value: nameNode.value,
//         funcs: [isRequired, isName],
//         parentNode: nameNode.parentElement,
//         controlNodes: [nameNode],
// });

//hàm xóa tất lỗi
const clearMsg = () => {
    //dom tới tất các các thằng có class is-invalid xóa nó đi cho ô hết đỏ
    document.querySelectorAll(".is-invalid").forEach((item) => {
        item.classList.remove("is-invalid");
    });
    //dom tới các ô có class invalid-feedback xóa hết
    document.querySelectorAll(".invalid-feedback").forEach((item) => {
        item.remove();
    });
};


//main flow
document.querySelector("form").addEventListener("submit", (event) => {
    //ngăn nó load lại trước
    event.preventDefault();
    //xóa để chuẩn bị cho các lỗi mới khi submit
    clearMsg();
    //dom vào mấy ô input
    let nameNode = document.querySelector("#name");
    let emailNode = document.querySelector("#email");
    let phoneNode = document.querySelector("#phone");
    let messageNode = document.querySelector("#message");

    let formValid = [
        isValid({value: nameNode.value,
                funcs: [isRequired, isName],
                parentNode: nameNode.parentElement,
                controlNodes: [nameNode],}),
        isValid({
            value: emailNode.value,
            funcs: [isRequired, isEmail],
            parentNode: emailNode.parentElement,
            controlNodes: [emailNode],
        }),
        isValid({
            value: phoneNode.value,
            funcs: [isRequired, isPhone],
            parentNode: phoneNode.parentElement,
            controlNodes: [phoneNode],
        }),
        isValid({
            value: messageNode.value,
            funcs: [isRequired, min(9), max(40)],
            parentNode: messageNode.parentElement,
            controlNodes: [messageNode],
        }),
    ];
});

//viết sự kiện blur khi click vào rồi bấm ra thì báo đỏ cái ô và "that field is required"
document.querySelectorAll(".input-check").forEach((inputNode) => {
    inputNode.addEventListener("blur", (event) => {
        // nếu như cái ô input không có giá trị đồng thời chưa có đỏ thì làm
        if(event.target.value == "" && !event.target.classList.contains("is-invalid")){
            //tạo ra lỗi
            createMsg(event.target.parentElement, [event.target], "That field is required!");
        }
    });
});

//viết sự kiện xóa khi đã có nhập gì vào thì xóa mấy lỗi của ô đó đi
document.querySelectorAll(".input-check").forEach((inputNode) => {
    inputNode.addEventListener("input", (event) => {
        if(event.target != ""){
            //xóa hết lỗi đi
            event.target.classList.remove("is-invalid");
            //nhìn xuống thằng dưới xóa nó luôn
            event.target.nextElementSibling.remove();
        };
    });
});

//**Giúp cho trang web chuyển mượt hơn
window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 1000)
};

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
});
