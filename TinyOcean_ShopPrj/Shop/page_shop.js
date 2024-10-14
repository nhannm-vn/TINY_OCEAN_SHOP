//--------------------------------------------------
//**Giúp cho trang web chuyển mượt hơn
window.transitionToPage = function (href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function () {
        window.location.href = href
    }, 1000)
};

document.addEventListener('DOMContentLoaded', function (event) {
    document.querySelector('body').style.opacity = 1
});

//-------------------------------------------------------------
//**Hàm giúp biết đang đứng ở trang nào thì nút trang đó sáng lên
document.querySelectorAll(".link-pop-up").forEach((link) => {
    if (link.getAttribute("id") == "pop") {
        link.classList.add("actived");
    };
});

// ------------------------------------------------------------
// Hiệu ứng mờ dần cho sản phẩm khi xuất hiện trong viewport
function lazyLoadProducts() {
    document.querySelectorAll('.product-card').forEach(item => {
        new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                item.classList.add('show');
                observer.unobserve(item); // Ngừng theo dõi khi đã hiển thị
            }
        }).observe(item);
    });
};

// Gọi hàm lazyLoadProducts sau khi render sản phẩm
// ------------------------------------------------------------

//cần phải bọc cái hàm vậy để sự kiện click phù hợp
//vì sẽ có bug nên mình cần khi render thì cho chức năng bấm nhảy số diễn ra
/*
Vấn đề của bạn là ở việc các sự kiện click được gán cho các nút tăng và giảm trước khi các sản phẩm được hiển thị từ server. 
Khi bạn gọi ui.renderProducts(products);, các nút mới được thêm vào DOM và không có sự kiện click được gán cho chúng. 
Điều này có nghĩa là các sự kiện bạn đã gán ban đầu không còn tác dụng trên các phần tử mới được render.

==> nghĩa là vì server nó mất một khoảng thời gian thì nó mới đưa dữ liệu cho hiển thị trên ui
mà vì trong khoảng thời gian chờ đó thì đâu có gì đâu để dom tới mà có tính năng
*/

// chức năng tăng giảm khi mua sản phẩm
document.addEventListener("DOMContentLoaded", function () {
    // Khởi tạo các sản phẩm và render chúng
    const store = new Store();
    const ui = new RenderUI();
    store.getProducts().then((products) => {
        // sau khi lấy dữ liệu xong thì tắt cái loader đi
        document.querySelector(".loader").style.display = "none";
        // hiển thị cái nút load more
        document.querySelector(".btn-more").style.display = "block";
        // ----------------------------------------------------------------
        //mình hiển thị 21 sản phẩm đầu trước. Rồi nếu bấm vào nút load more thì hiện tiếp
        //lấy cái mảng 21 sp thôi
        let productListFirst = products.slice(0, 21);
        ui.renderProducts(productListFirst);
        // ----------------------------------------------------------------
        //khi bấm vào cá nút load more thì hiển thị thêm các sản phẩm ở dưới
        //đồng thời tắt luôn cái nút
        document.querySelector("#button-more").addEventListener("click", (event) => {
            event.preventDefault();
            // tắt cái nút load more đi
            document.querySelector(".btn-more").style.display = "none";
            //**chúng ra cần hiện thị lại toàn bộ danh sách, chứ nếu chỉ hiển thị một đoạn dưới
            //thì bên trên sẽ bị mất
            ui.renderProducts(products);
            //***Lưu ý phải có sản phẩm thì mới biến tấu được
            // -------------------------------------------------------------------------------------------
            document.querySelectorAll(".product-card").forEach((cardElement, cardIndex) => {
                if (cardIndex == 23) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>Best Seller</p>
                                                       </div>`;
                } else if (cardIndex == 25) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>New</p>
                                                       </div>`;
                } else if (cardIndex == 31) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>Sale 5%</p>
                                                       </div>`;
                    cardElement.children[1].innerHTML = `<h5 class="card-title">I'm a product</h5>
                                                    <p class="card-text"><del>$8.00</del> $7.60</p>
                                                    <div class="input-group">
                                                        <button class="btn-decrease" type="button">-</button>
                                                        <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                                        <button class="btn-increase" type="button">+</button>
                                                    </div>
                                                    <button class="btn-primary">Add to Cart</button>
                                                    `;
                }
            });
            // -------------------------------------------------------------------------------------------

            //Vì thằng này render lại từ đầu nên mình cũng xài công nghệ lại
            //***Lưu ý phải có sản phẩm thì mới biến tấu được
            // -------------------------------------------------------------------------------------------
            document.querySelectorAll(".product-card").forEach((cardElement, cardIndex) => {
                if (cardIndex == 2) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>Best Seller</p>
                                                       </div>`;
                } else if (cardIndex == 3) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>New</p>
                                                       </div>`;
                } else if (cardIndex == 5) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>Sale 10%</p>
                                                       </div>`;
                    cardElement.children[1].innerHTML = `<h5 class="card-title">I'm a product</h5>
                                                    <p class="card-text"><del>$12.00</del> 10.80</p>
                                                    <div class="input-group">
                                                        <button class="btn-decrease" type="button">-</button>
                                                        <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                                        <button class="btn-increase" type="button">+</button>
                                                    </div>
                                                    <button class="btn-primary">Add to Cart</button>
                                                    `;
                } else if (cardIndex == 7) {
                    cardElement.children[0].innerHTML += ` <div style="background-color: red;" class="specicalPosition">
                                                             <p>Sale 50%</p>
                                                           </div>`;
                    cardElement.children[1].innerHTML = `
                                                    <h5 class="card-title">I'm a product</h5>
                                                    <p class="card-text"><del>$18.00</del> $9.00</p>
                                                    <div class="input-group">
                                                        <button class="btn-decrease" type="button">-</button>
                                                        <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                                        <button class="btn-increase" type="button">+</button>
                                                    </div>
                                                    <button class="btn-primary">Add to Cart</button>
                                                    `;
                } else if (cardIndex == 10) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                            <p>New</p>
                                                           </div>`;
                } else if (cardIndex == 15) {
                    cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                              <p>Best Seller</p>
                                                           </div>`;
                }
            });
            // -------------------------------------------------------------------------------------------
        });

        // ----------------------------------------------------------------
        let isLoading = false;

        // Observer theo dõi khi 'load-more-trigger' vào viewport
        let observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                isLoading = true;
                ui.renderProducts(productListFirst); // Hàm render sản phẩm của bạn
                isLoading = false;
            }
        }, { threshold: 1.0 });

        // Bắt đầu theo dõi phần tử trigger
        // observer.observe(document.getElementById('load-more-trigger'));
        ///// --------------------/////----------------------------------/////

        // ----------------------------------------------------------------
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const decreaseButtons = document.querySelectorAll('.btn-decrease');
        const increaseButtons = document.querySelectorAll('.btn-increase');
        // ----------------------------------------------------------------
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

        //***Lưu ý phải có sản phẩm thì mới biến tấu được
        // -------------------------------------------------------------------------------------------
        document.querySelectorAll(".product-card").forEach((cardElement, cardIndex) => {
            if (cardIndex == 2) {
                cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>Best Seller</p>
                                                       </div>`;
            } else if (cardIndex == 3) {
                cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>New</p>
                                                       </div>`;
            } else if (cardIndex == 5) {
                cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>Sale 10%</p>
                                                       </div>`;
                cardElement.children[1].innerHTML = `<h5 class="card-title">I'm a product</h5>
                                                    <p class="card-text"><del>$12.00</del> 10.80</p>
                                                    <div class="input-group">
                                                        <button class="btn-decrease" type="button">-</button>
                                                        <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                                        <button class="btn-increase" type="button">+</button>
                                                    </div>
                                                    <button class="btn-primary">Add to Cart</button>
                                                    `;
            } else if (cardIndex == 7) {
                cardElement.children[0].innerHTML += ` <div style="background-color: red;" class="specicalPosition">
                                                         <p>Sale 50%</p>
                                                       </div>`;
                cardElement.children[1].innerHTML = `
                                                <h5 class="card-title">I'm a product</h5>
                                                <p class="card-text"><del>$18.00</del> $9.00</p>
                                                <div class="input-group">
                                                    <button class="btn-decrease" type="button">-</button>
                                                    <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                                    <button class="btn-increase" type="button">+</button>
                                                </div>
                                                <button class="btn-primary">Add to Cart</button>
                                                `;
            } else if (cardIndex == 10) {
                cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                        <p>New</p>
                                                       </div>`;
            } else if (cardIndex == 15) {
                cardElement.children[0].innerHTML += ` <div class="specicalPosition">
                                                          <p>Best Seller</p>
                                                       </div>`;
            }
        });

    });
});

// -------------------------------------------------------------------------------------------
//bắt sự kiện khi click vào icon buy thì hiện ra cái cart
document.querySelector(".header-shop-right-buy").addEventListener("click", (event) => {
    document.querySelector(".block-cart").style.display = "block";
    // đồng thời cho độ dài của cái tab tăng lên theo %
    let cartTab = document.querySelector(".cart-tab");
    let width = 0; //chiều rộng ban đầu
    const targetWidth = 25; // Chiều rộng mong muốn (25%)
    const step = 0.5; // Bước tăng (0.5%)
    // Thiết lập interval để tăng chiều rộng từng bước
    const interval = setInterval(() => {
        if(width < targetWidth){
            //nó sẽ tăng lên dần dần
            width += step;// Tăng chiều rộng
            //cập nhật chiều rộng
            cartTab.style.width = width + "%";
        }else{//nếu vượt quá thì dừng lại nhé, **Lưu ý setInterVal muốn dừng thì phải hứng
            clearInterval(interval);
        }
    }, 4);//mỗi 4ms thì cứ tăng dần lên
});

//sự kiện bấm vào cái nút muỗi tên thì tắt hết và thu dần cái cart lại
document.querySelector(".cart-tab-header-btn").addEventListener("click", (event) => {
    //thu dần cái cart lại xong đó mới tắt thằng mờ
    let cartTab = document.querySelector(".cart-tab");
    let width = 25; // chiều rộng ban đầu
    const targetWidth = 0;//chiều rộng mong muốn 0%
    const step = 0.5; //bước giảm 0.5%
    //thiết lập interval để cho nó giảm dần
    const interval = setInterval(() => {
        if(width >= targetWidth){
            width -= step;
            //cập nhật
            cartTab.style.width = width + "%";
        }else{
            clearInterval(interval);
        }
    }, 4);//mỗi 4ms thì cứ giảm

    //sau khi giảm dần cái cart rồi thì tắt cái mờ đi
    setTimeout(() => {
        document.querySelector(".block-cart").style.display = "none";
    }, 1500);
    
});

//sự kiện bấm vào cái nút close trong cart thì thu dần cái cart và tắt luôn hiệu ứng
document.querySelector(".cart-tab-end_1").addEventListener("click", (event) => {
    //thu dần cái cart lại xong đó mới tắt thằng mờ
    let cartTab = document.querySelector(".cart-tab");
    let width = 25; // chiều rộng ban đầu
    const targetWidth = 0;//chiều rộng mong muốn 0%
    const step = 0.5; //bước giảm 0.5%
    //thiết lập interval để cho nó giảm dần
    const interval = setInterval(() => {
        if(width >= targetWidth){
            width -= step;
            //cập nhật
            cartTab.style.width = width + "%";
        }else{
            clearInterval(interval);
        }
    }, 4);//mỗi 4ms thì cứ giảm

    //sau khi giảm dần cái cart rồi thì tắt cái mờ đi
    setTimeout(() => {
        document.querySelector(".block-cart").style.display = "none";
    }, 1500);
    
});



//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

// Giao tiếp với server
const baseURL = "https://6703fdd1ab8a8f8927328adf.mockapi.io/tinyShop/products";

//tạo ra class chuyên đúc ra instance có method giao tiếp với server
class Http {
    //method send xài chung cho bộ api dùng để gửi request
    //vì có những api cần đưa lên nội dung cho server nên cần {} mô tả
    send(url, method, body) {
        //trả ra fetch luôn nghĩa là trả ra promise, ai cầm thì tự xử lí
        return fetch(url, {
            method: method,
            //định dạng dữ liệu truyền lên
            headers: { "Content-Type": "application/json" },
            //những gì truyền lên server thì bỏ vào body, có thì truyền k thì truyền null
            //lưu ý fetch thì định dạng dữ liệu phải là json
            body: body ? JSON.stringify(body) : null,
        })
            .then((response) => {
                //kiểm tra coi gói hàng server trả về nguyên vẹn không
                if (response.ok) {
                    return response.json();//trả ra promise<data>
                } else {
                    throw new Error(response.statusText);
                };
            });//ai gọi send() sẽ nhận được cục promise<data> rồi muốn làm gì thì làm
    };

    //bộ api
    get(url) {
        //ai gọi method này cũng trả ra promise<data> luôn
        return this.send(url, "GET", null);
    };

    delete(url) {
        return this.send(url, "DELETE", null);
    };
    //thêm item vào cuối mảng danh sách
    post(url, body) {
        return this.send(url, "POST", body);
    };

    //xóa item và cập nhật
    put(url, body) {
        return this.send(url, "PUT", body);
    };
};

//test thử
//tạo ra instance của nó để xài
let http = new Http();
// http.get(baseURL).then((data) => {
//     console.log(data);
// })
// http.put(`${baseURL}/5`,
//     { img: "https://static.wixstatic.com/media/ea71bb_0134ffa994a245cc89306d6f4cfa9f26~mv2_d_1920_1920_s_2.jpg/v1/fill/w_358,h_476,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/ea71bb_0134ffa994a245cc89306d6f4cfa9f26~mv2_d_1920_1920_s_2.jpg" }).then((data) => {
//         console.log(data);
//     });

//class Store: chuyên đúc ra những instance lưu trữ dữ liệu từ server 
class Store {
    // lưu sẵn thuộc tính là instance Http để dễ lấy và xử lí dữ liệu
    constructor() {
        this.http = new Http();
    };
    //trả ra promise<products>
    getProducts() {
        return this.http.get(baseURL);
    };
}

//class RenderUI chuyên đúc ra những instance có method render ra ui
class RenderUI {
    renderProducts(products) {
        //dồn tất cả bằng reduce sau đó hiển thị ra ui
        let htmlContent = products.reduce((total, { id, name, price, img }) => {
            return total += `
                    <div class="product-card">
                        <div class="card-img-wrapper">
                            <img src=${img}
                                class="card-img-top" alt="Product Image">
                            <p class="quickView">Quick View</p>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text">$${price}</p>
                            <div class="input-group">
                                <button class="btn-decrease" type="button">-</button>
                                <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                <button class="btn-increase" type="button">+</button>
                            </div>
                            <button class="btn-primary">Add to Cart</button>
                        </div>
                    </div>
                    `;
        }, "");
        //sau đó lấy tất cả hiển thị lên ui
        document.querySelector(".products-container").innerHTML = htmlContent;

        //thử nghiệm công nghệ
        //-------------------
        lazyLoadProducts();
    };
};



