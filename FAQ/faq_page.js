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

//-------------------------------------------------------------
//**Giúp cho bấm vào nút nào thì nút đó sẽ có thêm class đặc biệt 
//mà ai có class đó thì sẽ bị dính một màu
//**Hàm giúp biết đang đứng ở trang nào thì nút trang đó sáng lên
document.querySelectorAll(".link-pop-up").forEach((link) => {
    if(link.getAttribute("id") == "pop"){
        link.classList.add("actived");
        link.parentElement.previousElementSibling.classList.add("actived");
    };
});




