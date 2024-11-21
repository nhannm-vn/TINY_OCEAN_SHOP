//--------------------------------------------------
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

// -------------------------------------------------------------------------------
//sự kiện sau khi trang web load xong hêt thì hãy hiện danh sách ra đi
document.addEventListener("DOMContentLoaded", async () => {
  //gọi 2 instance ra
  const store = new Store();
  const ui = new RenderUI();
  //lấy danh sách của cart trước
  let cartList = await store.getProductsCart();
  //nhờ ui render ra dùm
  //**Trong lúc render ra thì tính tiền dùm luôn nhé
  ui.renderCartToView(cartList);
  //**Đếm số lượng sản phẩm trong mảng để hiện lên giỏ hàng
  let countElement = countCart(cartList);
  //hiện lên cái giỏ hàng
  ui.renderCountCart(countElement);
  //tính tiền của tổng các sản phẩm
  let priceAllProduct = caculationTotalPrice(cartList);
  //nhờ ui hiển thị ra đi
  ui.renderTotalMoneyAll(priceAllProduct);

  //bắt sự kiện bấm vào trash thì xóa hết phần tử trong mảng và render ra lại
  document
    .querySelector(".left-body")
    .addEventListener("click", async (event) => {
      //kiểm tra xem có bấm đúng cái thùng không
      if (event.target.classList.contains("trash-click")) {
        let isConfirmed = confirm(
          `Do you want delete product: ${event.target.parentElement.parentElement.children[1].children[0].textContent}`
        );
        if (isConfirmed) {
          //lấy diff
          let diffCart = event.target.parentElement.dataset.id;
          //lấy ra id dựa vào diff và danh sách
          let list = await store.getProductsCart();
          let keyId = findIdByDiff(diffCart, list);
          //nhờ store xóa khỏi danh sách
          let tmp = await store.deleteProductCart(keyId);
          //hứng lại danh sách và render ra lại
          let listAfterDel = await store.getProductsCart();
          //render ra lại danh sách sản phẩm
          ui.renderCartToView(listAfterDel);
          //sau khi xóa xong thì render ra lại, đồng thời tính lại tiền và hiển thị ra
          let priceAllProduct = caculationTotalPrice(listAfterDel);
          //nhờ ui hiển thị ra đi
          ui.renderTotalMoneyAll(priceAllProduct);

          //sau khi xóa xong cũng phải update lại số lượng sp của giỏ hàng
          //**Đếm số lượng sản phẩm trong mảng để hiện lên giỏ hàng
          let countElement = countCart(listAfterDel);
          //hiện lên cái giỏ hàng
          ui.renderCountCart(countElement);
        }
      }
    });
  // ---------------------------------------------------------------------------
});

//-------------------------------------------------------------------------------
//sự kiện khi bấm nhập mã code để giảm giá thì hãy hiện ra
document.querySelector(".promo-show").addEventListener("click", (event) => {
  event.preventDefault();
  //nếu chưa hiển thị thì bấm vào là hiển thị liền
  if (event.target.parentElement.nextElementSibling.style.display != "block") {
    document.querySelector(".promo-code").style.display = "block";
    document.querySelector(".promo-code-inp").value = "";
  } else {
    document.querySelector(".promo-code").style.display = "none";
  }
});

//-------------------------------------------------------------------------------
//sự kiện khi bấm vào ô xin feedback thì hãy hiện ra
document.querySelector(".show-addText").addEventListener("click", (event) => {
  event.preventDefault();
  //nếu chưa hiển thị thì bấm vào là hiển thị liền
  if (event.target.parentElement.nextElementSibling.style.display != "block") {
    document.querySelector(".addTextFeedBack").style.display = "block";
    document.querySelector(".addTextFeedBack-inp").value = "";
  } else {
    document.querySelector(".addTextFeedBack").style.display = "none";
  }
});

//*sự kiện khi bấm vào nút checkout thì hiện lên bảng chọn địa chỉ
document.querySelector(".sub-total-btn").addEventListener("click", (event) => {
  //khi bấm thì cho cái bảng chọn địa chỉ hiện lên lại
  setTimeout(() => {
    document.querySelector(".check_out_block").style.display = "block";
  }, 1000);
});
//*Sự kiện khi bấm vào nền ngoài thì tắt bảng chọn địa chỉ
document.querySelector(".check_out_sub").addEventListener("click", (event) => {
  setTimeout(() => {
    document.querySelector(".check_out_block").style.display = "none";
  }, 1000);
});
//--------------------------------------------------------------------------------
//*hàm tính tiền từng sản phẩm kèm theo số lượng
const caculationEachProduct = (price, quantity) => {
  return Number.parseInt(price) * Number.parseInt(quantity);
};

//*hàm đếm số lượng sản phẩm có trong list và hiển thị lên giỏ hàng
//Hàm đếm số lượng sản phẩm trong giỏ hàng
const countCart = (dataCartLast) => {
  let total = 0;
  dataCartLast.forEach((cartItem, cartIndex) => {
    total += Number.parseInt(cartItem.quantity);
  });
  return total + "";
};

//*hàm tính tổng số tiền với số lượng sp và giá tiền của mỗi loại
const caculationTotalPrice = (cartList) => {
  let total = 0;
  cartList.forEach(({ price, quantity }) => {
    total += Number.parseInt(price) * Number.parseInt(quantity);
  });
  return total;
};

//*hàm tìm id dựa vào diff
const findIdByDiff = (diff, cartList) => {
  return cartList.find((item) => {
    return item.diff == diff;
  }).id;
};

//--------------------------------------------------------------------------------

// Giao tiếp với server mockup API
const baseURL = "https://6703fdd1ab8a8f8927328adf.mockapi.io/tinyShop/products";
// Giao tiếp với mockup api
const baseURLCart =
  "https://6703fdd1ab8a8f8927328adf.mockapi.io/tinyShop/productsCart";

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
    }).then((response) => {
      //kiểm tra coi gói hàng server trả về nguyên vẹn không
      if (response.ok) {
        return response.json(); //trả ra promise<data>
      } else {
        throw new Error(response.statusText);
      }
    }); //ai gọi send() sẽ nhận được cục promise<data> rồi muốn làm gì thì làm
  }

  //bộ api
  get(url) {
    //ai gọi method này cũng trả ra promise<data> luôn
    return this.send(url, "GET", null);
  }

  delete(url) {
    return this.send(url, "DELETE", null);
  }
  //thêm item vào cuối mảng danh sách
  post(url, body) {
    return this.send(url, "POST", body);
  }

  //xóa item và cập nhật
  put(url, body) {
    return this.send(url, "PUT", body);
  }
}

//class Store: chuyên đúc ra những instance lưu trữ dữ liệu từ server
class Store {
  // lưu sẵn thuộc tính là instance Http để dễ lấy và xử lí dữ liệu
  constructor() {
    this.http = new Http();
  }
  //trả ra promise<product của cart>
  //lấy luôn giá trị luôn chứ k quăng promise gì nữa hết
  getProductsCart() {
    return this.http.get(baseURLCart);
  }

  //nhờ store xóa dùm cái cart đi
  deleteProductCart(id) {
    return this.http.delete(`${baseURLCart}/${id}`);
  }
}

//class RenderUI chuyên đúc ra những instance có method render ra ui
class RenderUI {
  //hiển thị các sản phẩm trong cart ra ngoài ui
  renderCartToView(cartList) {
    let htmlContent = cartList.reduce(
      (total, { id, name, price, cartImg, quantity, diff }) => {
        return (total += `
            <div class="left-body-card">
              <div class="card-img">
                <img
                  src="${cartImg}"
                  alt="File error"
                />
              </div>
              <div class="card-details">
                <p>${name}</p>
                <p>$${price}</p>
              </div>
              <div class="card-quantity">
                <p>${quantity}</p>
              </div>
              <div class="card-price">
                <p>$${caculationEachProduct(price, quantity)}</p>
              </div>
              <button data-id="${diff}" class="card-trash">
                <i class="fa-regular fa-trash-can trash-click"></i>
              </button>
            </div>
                    `);
      },
      ""
    );
    //dom tới và nhét vào
    document.querySelector(".left-body").innerHTML = htmlContent;
  }

  renderTotalMoneyAll(totalPrice) {
    let htmlContent = `
                  <p>$${totalPrice}</p>`;
    //nhét vào tới 2 chỗ
    document.querySelector(".sub-total-checkout").innerHTML = `
                                        <p>Total</p>
                                        <p>$${totalPrice}</p>`;
    document.querySelector(".sub-total-right").innerHTML = htmlContent;
  }

  //method render count
  renderCountCart = (countCart) => {
    let htmlContent = `
            <p style="color: aliceblue; margin: 0;">${countCart}</p>
        `;
    //dom tới và nhét nó vào
    document.querySelector(".header-shop-right-buy").children[1].innerHTML =
      htmlContent;
  };
}
