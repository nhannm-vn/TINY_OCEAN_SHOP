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
document.addEventListener("DOMContentLoaded", async function () {
    // Khởi tạo các sản phẩm và render chúng
    const store = new Store();
    const ui = new RenderUI();
    store.getProducts().then((products) => {
        // sau khi lấy dữ liệu xong thì tắt cái loader đi
        document.querySelector(".loader").style.display = "none";
        // hiển thị cái nút load more
        document.querySelector(".btn-more").style.display = "block";

        //mình hiển thị 21 sản phẩm đầu trước. Rồi nếu bấm vào nút load more thì hiện tiếp
        //lấy cái mảng 21 sp thôi
        let productListFirst = products.slice(0, 21);
        ui.renderProducts(productListFirst);

        //***Lưu ý phải có sản phẩm thì mới biến tấu được
        // -------------------------------------------------------------------------------------------
        // ----------------------------------------------------------------
        //Vì thằng này render lại từ đầu nên mình cũng xài công nghệ lại
        //****Thằng này mặc định reload là đã có rồi chứ không cần bấm nút gì hết mới có position đặc biệt
        //và nó cũng là page all nhiều nhất nên khác mấy page kia
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
                cardElement.children[1].innerHTML = 
                                                    `<h5 class="card-title">Oriental Plastic Pig</h5>
                                                    <p class="card-text"><del>$12.00</del> 10.80</p>
                                                    <div class="input-group">
                                                        <button class="btn-decrease" type="button">-</button>
                                                        <input type="number" min="1" value="1" class="quantity-input" onkeydown="return false;">
                                                        <button class="btn-increase" type="button">+</button>
                                                    </div>
                                                    <button class="btn-primary">Add to Cart</button>`
            } else if (cardIndex == 7) {
                cardElement.children[0].innerHTML += ` <div style="background-color: red;" class="specicalPosition">
                                                            <p>Sale 50%</p>
                                                        </div>`;
                cardElement.children[1].innerHTML = `
                                                <h5 class="card-title">Oriental Plastic Fish</h5>
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
        // -------------------------------------------------------------------------------------------
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
                    cardElement.children[1].innerHTML = 
                                                    `<h5 class="card-title">Oriental Plastic Pig</h5>
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
                                                    <h5 class="card-title">Oriental Plastic Fish</h5>
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
                    cardElement.children[1].innerHTML = `<h5 class="card-title">Practical Rubber Gloves</h5>
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
        });


        // ----------------------------------------------------------------
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


        // -----------------------------------------------------------------------------------
        // -----------------------------------------------------------------------------------
        //***Vì mình có chơi với products nên mình phải nằm bên trong ảnh, nghĩa là ảnh lấy danh sách xong
        //đưa mình thì mình mới xử lí tiếp được

        //Đầu tiên dom tới danh sách chứa các product trên ui, nếu bấm nhằm vào phần tử là cái nút
        //thì mình sẽ làm việc gì đó
        document.querySelector(".products-container").addEventListener("click", async (event) => {
            //nếu sự kiện nổ ra ngay trúng cái nút add-to-cart thì làm gì đó
            //mình sẽ kiểm tra bằng classList
            // alert(1);: dùng để test thử coi có dính sự kiện chưa
            if (event.target.classList.contains("btn-add-to-cart")) {
                let listCart = await store.getProductsCart();
                //lấy data-id của nó
                let dataId = event.target.getAttribute("data-id");
                //kiểm tra thử xem trong listCart đã có item trùng chưa
                //nếu chưa có thì thêm mới hoàn toàn, nếu có rồi thì cộng dồn quantity
                let checkDuplicate = listCart.every((item) => item.diff != dataId);
                console.log(checkDuplicate);
                
                if (checkDuplicate) {//nếu đúng thì thêm vào như không có gì xảy ra
                    //tìm trong products xem thằng nào có id = data-id của cái nút bấm
                    let cartItem = products.find((product) => (product.diff == dataId));
                    //thêm một thuộc tính cho object cartItem đó chính là quantity(sl) rồi đã nhét vào mảng listCart
                    //phải lấy bằng cách nhìn từ button dính sự kiện
                    cartItem.quantity = event.target.previousElementSibling.children[1].value;
                    // console.log(event.target.previousElementSibling.children[1].value);
                    //**Nhét cart mới đó lên server luôn
                    let newCart = await store.postProductCart(cartItem);

                    //**Sau khi móc dữ liệu update đồ hết rồi thì quay lại cho cái ô kia về value là 1
                    //  để chuẩn bị cho những lần tiếp theo
                    event.target.previousElementSibling.children[1].value = "1";
                }else{//trường hợp đã rồi rồi thì update quantity
                    let cartUpdate = listCart.find((item) => (item.diff == dataId));
                    //sau đó update phần tử đó
                    let quantityUpdate = Number.parseInt(event.target.previousElementSibling.children[1].value) + Number.parseInt(cartUpdate.quantity) + "";
                    //**Nhờ store update giúp mình luôn
                    let updateCart = await store.putProductCart(cartUpdate.id, {quantity: quantityUpdate});
                    

                    //**Sau khi móc dữ liệu update đồ hết rồi thì quay lại cho cái ô kia về value là 1
                    //  để chuẩn bị cho những lần tiếp theo
                    event.target.previousElementSibling.children[1].value = "1";
                };

                let afterData = await store.getProductsCart();
                ui.renderCarts(afterData);
            };
        });
    });
    //sau khi load xong hết rồi thì mình lấy danh sách xuống và hiện thị, mỗi khi ctrl hiển thị lại và không bị mất
    let dataCartLast = await store.getProductsCart();
    ui.renderCarts(dataCartLast);
    // -----------------------------------------------------------------------------------
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
        if (width < targetWidth) {
            //nó sẽ tăng lên dần dần
            width += step;// Tăng chiều rộng
            //cập nhật chiều rộng
            cartTab.style.width = width + "%";
        } else {//nếu vượt quá thì dừng lại nhé, **Lưu ý setInterVal muốn dừng thì phải hứng
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
        if (width >= targetWidth) {
            width -= step;
            //cập nhật
            cartTab.style.width = width + "%";
        } else {
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
        if (width >= targetWidth) {
            width -= step;
            //cập nhật
            cartTab.style.width = width + "%";
        } else {
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

// Giao tiếp với server mockup API
const baseURL = "https://6703fdd1ab8a8f8927328adf.mockapi.io/tinyShop/products";

// Giao tiếp với file json 
const baseURLCart = "https://6703fdd1ab8a8f8927328adf.mockapi.io/tinyShop/productsCart";

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

    //trả ra promise<product của cart>
    //lấy luôn giá trị luôn chứ k quăng promise gì nữa hết
    getProductsCart(){
        return this.http.get(baseURLCart);
    };

    //thêm sản phẩm vào mảng cartList
    postProductCart(body){
        return this.http.post(baseURLCart, body);
    };

    //update sản phầm trong cartList
    putProductCart(id, body){
        return this.http.put(`${baseURLCart}/${id}`, body);
    }

}

//class RenderUI chuyên đúc ra những instance có method render ra ui
class RenderUI {
    renderProducts(products) {
        //dồn tất cả bằng reduce sau đó hiển thị ra ui
        let htmlContent = products.reduce((total, { id, name, price, img, diff }) => {
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
                            <button data-id=${diff} class="btn-primary btn-add-to-cart">Add to Cart</button>
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

    //hàm renderCartsInDivCart(cart): nhận vào cart và hiển thị cộng dồn bên div cart
    // renderCartsInDivCart({ id, name, price, cartImg, quantity }){
    //     let htmlContent = 
    //             `<div class="cart-item">
    //                 <div class="cart-item-left">
    //                     <img src=${cartImg}
    //                         alt="File error">
    //                 </div>
    //                 <div class="cart-item-right">
    //                     <p>${name}
    //                     </p>
    //                     <h4>
    //                         $${price}
    //                     </h4>
    //                     <div class="cart-item-count">
    //                         <p>${quantity}</p>
    //                     </div>
    //                 </div>
    //                 <div class="cart-item-x">
    //                     <button data-id=${id} class="cart-item-x-btn">
    //                         <i class="fa-regular fa-circle-xmark"></i>
    //                     </button>
    //                 </div>
    //             </div>`;
    //     //dom tới và hiển thị cộng dồn trên ui
    //     document.querySelector(".cart-tab-body").innerHTML += htmlContent;
    // }

    //hàm renderCarts(cartList): nhận vào cartList và từ đó hiển thị ra màn hình
    renderCarts(cartList) {
        let htmlContent = cartList.reduce((total, { id, name, price, cartImg, quantity, diff }) => {
            return total +=
                `   <div class="cart-item">
                    <div class="cart-item-left">
                        <img src=${cartImg}
                            alt="File error">
                    </div>
                    <div class="cart-item-right">
                        <p>${name}
                        </p>
                        <h4>
                            $${price}
                        </h4>
                        <div class="cart-item-count">
                            <p>${quantity}</p>
                        </div>
                    </div>
                    <div class="cart-item-x">
                        <button data-id=${diff} class="cart-item-x-btn">
                            <i class="fa-regular fa-circle-xmark"></i>
                        </button>
                    </div>
                </div>`
        }, "");
        //dom tới và hiển thị lên ui
        document.querySelector(".cart-tab-body").innerHTML = htmlContent;
    };
};



