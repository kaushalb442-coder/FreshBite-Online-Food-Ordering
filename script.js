const restaurants=[
{id:1,name:"Spice Garden",type:"Indian • North Indian",rating:"4.8",time:"25–35 min",emoji:"🍛",items:[
{name:"Paneer Tikka",price:220,emoji:"🧀"},{name:"Butter Chicken",price:280,emoji:"🍗"},{name:"Veg Biryani",price:190,emoji:"🍚"},{name:"Garlic Naan",price:70,emoji:"🫓"}]},
{id:2,name:"Pizza House",type:"Pizza • Italian",rating:"4.7",time:"20–30 min",emoji:"🍕",items:[
{name:"Margherita Pizza",price:249,emoji:"🍕"},{name:"Farmhouse Pizza",price:329,emoji:"🍕"},{name:"Cheese Garlic Bread",price:149,emoji:"🥖"},{name:"Pasta Alfredo",price:229,emoji:"🍝"}]},
{id:3,name:"Burger Hub",type:"Burgers • Fast Food",rating:"4.6",time:"15–25 min",emoji:"🍔",items:[
{name:"Classic Burger",price:159,emoji:"🍔"},{name:"Cheese Burger",price:189,emoji:"🍔"},{name:"French Fries",price:99,emoji:"🍟"},{name:"Cold Coffee",price:119,emoji:"🥤"}]},
{id:4,name:"Green Bowl",type:"Healthy • Salads",rating:"4.9",time:"20–30 min",emoji:"🥗",items:[
{name:"Paneer Salad",price:199,emoji:"🥗"},{name:"Veggie Bowl",price:179,emoji:"🥙"},{name:"Fruit Bowl",price:149,emoji:"🍓"},{name:"Fresh Juice",price:109,emoji:"🧃"}]}
];

let cart=JSON.parse(localStorage.getItem("freshbite_cart")||"[]");
let orders=JSON.parse(localStorage.getItem("freshbite_orders")||"[]");

function save(){localStorage.setItem("freshbite_cart",JSON.stringify(cart));localStorage.setItem("freshbite_orders",JSON.stringify(orders));}
function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".navbtn").forEach(x=>x.classList.toggle("active",x.dataset.page===id));if(id==="restaurants")renderRestaurants();if(id==="orders")renderOrders();if(id==="admin")renderAdmin();window.scrollTo(0,0)}
document.querySelectorAll(".navbtn").forEach(b=>b.onclick=()=>showPage(b.dataset.page));

function renderRestaurants(){
 const q=(document.getElementById("search")?.value||"").toLowerCase();
 document.getElementById("restaurantGrid").innerHTML=restaurants.filter(r=>(r.name+" "+r.type+" "+r.items.map(i=>i.name).join(" ")).toLowerCase().includes(q)).map(card).join("");
}
function card(r){return `<div class="restaurant"><div class="restaurant-img">${r.emoji}</div><div class="restaurant-body"><h3>${r.name}</h3><div class="muted">${r.type}</div><p><span class="rating">★ ${r.rating}</span> &nbsp; • &nbsp; ${r.time}</p><button class="view" onclick="openMenu(${r.id})">View Menu</button></div></div>`}
function renderPopular(){document.getElementById("popular").innerHTML=restaurants.slice(0,3).map(card).join("")}
function openMenu(id){let r=restaurants.find(x=>x.id===id);document.getElementById("menuHeader").innerHTML=`<div class="restaurant" style="padding:20px;margin-top:15px"><div style="font-size:55px">${r.emoji}</div><h2 style="margin:8px 0">${r.name}</h2><p class="muted">${r.type} • ★ ${r.rating} • ${r.time}</p></div>`;document.getElementById("menuGrid").innerHTML=r.items.map((i,idx)=>`<div class="menu-item"><span class="food">${i.emoji}</span><button class="add" onclick="addToCart(${r.id},${idx})">+ Add</button><h3>${i.name}</h3><span class="price">₹${i.price}</span></div>`).join("");showPage("menuPage")}
function addToCart(rid,idx){let r=restaurants.find(x=>x.id===rid),item=r.items[idx];let existing=cart.find(x=>x.rid===rid&&x.name===item.name);if(existing)existing.qty++;else cart.push({rid,name:item.name,price:item.price,emoji:item.emoji,qty:1});save();renderCart();toast("Added to cart");}
function renderCart(){let count=cart.reduce((a,x)=>a+x.qty,0);document.getElementById("cartCount").textContent=count;document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><span>${x.emoji}</span><div class="grow"><b>${x.name}</b><div class="muted">₹${x.price} each</div></div><div class="qty"><button onclick="changeQty(${i},-1)">−</button> ${x.qty} <button onclick="changeQty(${i},1)">+</button></div></div>`).join(""):"<p class='muted'>Your cart is empty. Add some delicious food!</p>";document.getElementById("cartTotal").textContent="₹"+cart.reduce((a,x)=>a+x.price*x.qty,0)}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save();renderCart()}
document.getElementById("cartBtn").onclick=()=>{renderCart();document.getElementById("cartPanel").classList.remove("hidden")}
function closeCart(){document.getElementById("cartPanel").classList.add("hidden")}
function checkout(){if(!cart.length){toast("Cart is empty");return}let total=cart.reduce((a,x)=>a+x.price*x.qty,0);orders.unshift({id:"FB"+Date.now().toString().slice(-6),items:[...cart],total,status:0,date:new Date().toLocaleString()});cart=[];save();closeCart();renderCart();toast("Order placed successfully!");showPage("orders")}
function renderOrders(){let box=document.getElementById("ordersList");if(!orders.length){box.innerHTML="<div class='order'><p>No orders yet.</p><button class='primary' onclick=\"showPage('restaurants')\">Order Now</button></div>";return}box.innerHTML=orders.map(o=>`<div class="order"><div style="display:flex;justify-content:space-between"><div><b>Order #${o.id}</b><div class="muted">${o.date}</div></div><span class="status">${["Order Placed","Preparing","Out for Delivery","Delivered"][o.status]}</span></div><p>${o.items.map(i=>`${i.name} × ${i.qty}`).join(", ")}</p><b>Total: ₹${o.total}</b><div class="steps">${["Placed","Preparing","On the way","Delivered"].map((s,i)=>`<div class="step ${i<=o.status?"done":""}">●<br>${s}</div>`).join("")}</div></div>`).join("")}
function renderAdmin(){let r=restaurants[0];document.getElementById("adminMenu").innerHTML=r.items.map((x,i)=>`<div class="admin-row"><span>${x.emoji} ${x.name} — ₹${x.price}</span><button class="delete" onclick="deleteMenuItem(${i})">Delete</button></div>`).join("")}
function addMenuItem(){let n=document.getElementById("newName").value.trim(),p=Number(document.getElementById("newPrice").value);if(!n||!p){toast("Enter item name and price");return}restaurants[0].items.push({name:n,price:p,emoji:"🍽️"});document.getElementById("newName").value="";document.getElementById("newPrice").value="";renderAdmin();toast("Menu item added")}
function deleteMenuItem(i){restaurants[0].items.splice(i,1);renderAdmin();toast("Menu item removed")}
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",1800)}
renderPopular();renderRestaurants();renderCart();
