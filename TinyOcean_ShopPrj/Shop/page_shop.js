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
//**Hàm giúp biết đang đứng ở trang nào thì nút trang đó sáng lên
document.querySelectorAll(".link-pop-up").forEach((link) => {
    if(link.getAttribute("id") == "pop"){
        link.classList.add("actived");
    };
});



// chức năng tăng giảm khi mua sản phẩm
document.addEventListener('DOMContentLoaded', function () {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const decreaseButtons = document.querySelectorAll('.btn-decrease');
    const increaseButtons = document.querySelectorAll('.btn-increase');

    decreaseButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            let input = quantityInputs[index];
            let currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateButtonState(input, button);
            }
        });
    });

    increaseButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            let input = quantityInputs[index];
            let currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateButtonState(input, decreaseButtons[index]);
        });
    });

    // Cập nhật trạng thái của các nút
    function updateButtonState(input, decreaseButton) {
        if (input.value <= 1) {
            decreaseButton.classList.add('disabled');
        } else {
            decreaseButton.classList.remove('disabled');
        }
    }

    // Kiểm tra lần đầu tiên khi tải trang
    quantityInputs.forEach((input, index) => {
        updateButtonState(input, decreaseButtons[index]);
    });

    // Ngăn chặn dấu mũi tên tăng giảm trong input type=number
    quantityInputs.forEach((input) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        });
    });
});
