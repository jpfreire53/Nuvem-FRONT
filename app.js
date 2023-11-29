const productList = document.querySelector("#products");
const addProductForm = document.querySelector("#add-product-form");
const updateProductForm = document.querySelector("#update-product-form");
const updateProductId = document.querySelector("#update-id");
const updateProductName = document.querySelector("#update-name");
const updateProductPrice = document.querySelector("#update-price");
const updateProductDescription = document.querySelector("#update-description");

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch("http://3.134.86.245:3000/products");
  const products = await response.json();

  // Clear product list
  productList.innerHTML = "";

  // Add each product to the list
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `${product.name} - $${product.price} - ${product.description}`;

    // Add delete button for each product
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.addEventListener("click", () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = addProductForm.elements["name"].value;
  const description = addProductForm.elements["description"].value;
  const price = addProductForm.elements["price"].value;
  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

updateProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;

  await updateProduct(id, name, description, price);
  updateProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, description, price) {
  const response = await fetch("http://3.134.86.245:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, price }),
  });
  return response.json();
}

// Function to delete a new product
async function deleteProduct(id) {
  const response = await fetch("http://3.134.86.245:3000/products/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  return response.json();
}

async function fetchProductById(id) {
  try {
    const response = await fetch(`http://3.134.86.245:3000/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product = await response.json();

    // Adicione logs para depurar
    console.log("Product by ID:", product);

    // Verifique se os atributos estão definidos
    console.log("ID:", product.id);
    console.log("Name:", product.name);
    console.log("Description:", product.description);
    console.log("Price:", product.price);

    return product;
  } catch (error) {
    console.error("Error fetching product:", error.message);
    // Lidar com o erro conforme necessário
  }
}

async function updateProduct(id, name, description, price) {
  const response = await fetch(`http://3.134.86.245:3000/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, price }),
  });
  return response.json();
}

// Fetch all products on page load
fetchProducts();
