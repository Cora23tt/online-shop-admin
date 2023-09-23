// products.js
import { cfg } from './main.js'

async function renderProducts() {
    const products = await fetchProducts();
    const productsListGroup = $('#products-list-group');
    productsListGroup.empty();
    for (const product of products) {

        const category = await fetchCategory(product.category_id);

        const categoryName = category.translations.find(translation => translation.language_code === 'en')?.name || '';

        const listItem = createProductListItem(product, categoryName);
        productsListGroup.append(listItem);
    }

    $('#create-new-product-btn').on('click', renderEditProductPage);
}

async function renderEditProductPage(productId = 0) {

    const [productEn, productRu] = await Promise.all([
        fetchProduct(productId, 'en'),
        fetchProduct(productId, 'ru')
    ]);

    const categories = await fetchCategories();
    var selectElement = $('#productCategory');
    selectElement.empty();

    $.each(categories, (index, category) => {
        const option = $('<option>', {
            value: category.id,
            text: category.translations[0].name
        });
        selectElement.append(option);
    });

    $('#productNameEn').val(productEn.name);
    $('#productDescriptionEn').val(productEn.description);
    $('#productNameRu').val(productRu.name);
    $('#productDescriptionRu').val(productRu.description);
    selectElement.val(productEn.category_id);

    const imagePreview = $('#imagePreview');
    const productImages = $('#productImages');

    imagePreview.empty();
    productImages.on('change', function () {
        imagePreview.empty();
        const files = productImages[0].files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function (e) {
                $('<img>', {
                    src: e.target.result,
                    class: 'img-thumbnail mr-2'
                }).appendTo(imagePreview);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#editProductForm').on('submit', function (e) {
        e.preventDefault();
        if (productId) {
            updateProduct();
        } else {
            createProduct();
        }
        console.log('Form submitted. Data processing...');
    });

    window.location.hash = '#editproduct';
}

async function fetchProducts() {
    let attempts = 0;
    let products = [];
    while (attempts < cfg.maxRequests) {
        try {
            const response = await fetch(cfg.apiUrl + '/api/en/product/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                },
            });
            if (response.status == 401) handleUnauthorized();
            if (!response.ok) {
                throw new Error(`Error fetching product data. Status: ${response.status}`);
            }
            const data = await response.json();
            products = data.products;
            break;
        } catch (error) {
            console.error('Error fetching product data:', error);
            attempts++;
            if (attempts >= cfg.maxRequests) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
        }
    }
    return products;
}

async function fetchProduct(id, lang) {
    let attempts = 0;
    let product = {};
    while (attempts < cfg.maxRequests) {
        try {
            const response = await fetch(cfg.apiUrl + `/api/${lang}/product/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                },
            });
            if (response.status == 401) handleUnauthorized();
            if (!response.ok) {
                throw new Error(`Error fetching product. Status: ${response.status}`);
            }
            const data = await response.json();
            product = data.product;
            break;
        } catch (error) {
            console.error('Error fetching product data:', error);
            attempts++;
            if (attempts >= cfg.maxRequests) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
        }
    }
    return product;
}

async function fetchCategory(id) {
    let attempts = 0;
    let category = {};
    while (attempts < cfg.maxRequests) {
        try {
            const response = await fetch(cfg.apiUrl + `/api/en/category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                },
            });
            if (response.status == 401) handleUnauthorized();
            if (!response.ok) {
                throw new Error(`Error fetching product data. Status: ${response.status}`);
            }
            const data = await response.json();
            category = data.category;
            break;
        } catch (error) {
            console.error('Error fetching categories:', error);
            attempts++;
            if (attempts >= cfg.maxRequests) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
        }
    }
    return category;
}

async function fetchCategories() {
    let attempts = 0;
    let categories = [];
    while (attempts < cfg.maxRequests) {
        try {
            const response = await fetch(cfg.apiUrl + '/api/en/category/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                },
            });
            if (response.status == 401) handleUnauthorized();
            if (!response.ok) {
                throw new Error(`Error fetching product data. Status: ${response.status}`);
            }
            const data = await response.json();
            categories = data.categories;
            break;
        } catch (error) {
            console.error('Error fetching categories:', error);
            attempts++;
            if (attempts >= cfg.maxRequests) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, cfg.retryDelay));
        }
    }
    return categories;
}

function updateProduct() {

}

function createProduct() {

}

function handleUnauthorized() {
    localStorage.removeItem("session-token");
    location.hash = '';
    location.reload();
}

function createProductListItem(product, categoryName) {
    const listItem = $('<a></a>')
        .addClass('list-group-item list-group-item-action')
        .attr('href', '#')
        .attr('aria-current', true)
        .on('click', () => renderEditProductPage(product.id));

    const element = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${product.name}</h5>
            <small><u>${categoryName}</u></small>
        </div>
        <p class="mb-1">${product.description}</p>
        <small>Price: $${product.price} | Available: ${product.quantity} | ${product.expiration_date}</small>
        <div style="display: none;">${product.id}</div>
    `;

    listItem.html(element);
    return listItem;
}

export { renderProducts };