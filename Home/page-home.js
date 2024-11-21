//**Giúp cho trang web chuyển mượt hơn
window.transitionToPage = function (href) {
  document.querySelector("body").style.opacity = 0;
  setTimeout(function () {
    window.location.href = href;
  }, 1000);
};

document.addEventListener("DOMContentLoaded", function (event) {
  document.querySelector("body").style.opacity = 1;
});

//-------------------------------------------------------------
//**Giúp cho bấm vào nút nào thì nút đó sẽ có thêm class đặc biệt
//mà ai có class đó thì sẽ bị dính một màu
//**Hàm giúp biết đang đứng ở trang nào thì nút trang đó sáng lên
document.querySelectorAll(".link-pop-up").forEach((link) => {
  if (link.id == "pop") {
    link.classList.add("actived");
    // link.parentElement.previousElementSibling.classList.add("actived");
  }
});

// hiệu ứng của ba cái hình nè
document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả các phần tử chứa chữ trong hình
  const overlayTexts = document.querySelectorAll(".overlay-text");

  // Thêm hiệu ứng hiện dần cho mỗi phần tử
  overlayTexts.forEach((overlay) => {
    overlay.style.opacity = 0; // Đặt opacity ban đầu là 0
    overlay.style.transition = "opacity 4"; // Tạo hiệu ứng chuyển dần opacity trong 2 giây

    // Kích hoạt hiệu ứng hiện dần lên
    setTimeout(() => {
      overlay.style.opacity = 1; // Tăng opacity lên 1 để chữ hiện dần
    }, 500); // Thời gian delay ngắn để chắc chắn trang đã load xong
  });
});

//hiệu ứng của bà đoạn văn với bà nút nè :))))))
document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả các phần tử chứa chữ cần hiện dần
  const textSection = document.querySelector(".section-text");

  // Kích hoạt hiệu ứng hiện dần lên sau khi load trang
  setTimeout(() => {
    textSection.style.opacity = 1; // Tăng opacity lên 1 để chữ hiện dần
  }, 550); // Thời gian delay ngắn để chắc chắn trang đã load xong
});
