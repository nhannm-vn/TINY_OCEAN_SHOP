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
