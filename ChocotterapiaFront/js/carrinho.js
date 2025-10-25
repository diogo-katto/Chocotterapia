const API_URL = "http://localhost:5150/api/produtos";
let listaCarrinho, totalCarrinho;

async function carregarCarrinho() {
    try {
        // Garante que os elementos existem
        listaCarrinho = document.getElementById("carrinho-lista");
        totalCarrinho = document.getElementById("carrinho-total");
        
        if (!listaCarrinho || !totalCarrinho) {
            console.error("Elementos do carrinho não encontrados");
            return;
        }

        // Carrega IDs do localStorage
        const idsCarrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        if (idsCarrinho.length === 0) {
            listaCarrinho.innerHTML = '<p class="text-center alert alert-info">Seu carrinho está vazio</p>';
            totalCarrinho.textContent = 'R$ 0,00';
            return;
        }

        // Busca produtos da API
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao buscar produtos");
        const produtos = await resposta.json();

        // Calcula quantidade de cada item
        const quantidades = idsCarrinho.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});

        // Filtra produtos do carrinho e adiciona quantidade
        const produtosCarrinho = produtos
            .filter(p => quantidades[p.id])
            .map(p => ({ ...p, quantidade: quantidades[p.id] }));

        exibirItensCarrinho(produtosCarrinho);

    } catch (erro) {
        console.error("Erro:", erro);
        listaCarrinho.innerHTML = '<p class="text-center text-danger">Erro ao carregar o carrinho</p>';
    }
}

function exibirItensCarrinho(produtos) {
    let html = '';
    let total = 0;

    produtos.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        html += `
            <div class="card mb-3 shadow-sm">
                <div class="row g-0 align-items-center">
                    <div class="col-md-2">
                        <img src="${produto.imagemUrl || 'https://via.placeholder.com/100'}" 
                             class="img-fluid rounded-start" alt="${produto.nome}">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text">
                                R$ ${produto.preco.toFixed(2)} x ${produto.quantidade}
                                <br>
                                <small class="text-muted">Subtotal: R$ ${subtotal.toFixed(2)}</small>
                            </p>
                        </div>
                    </div>
                    <div class="col-md-3 text-end p-3">
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="removerItem(${produto.id})">
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    listaCarrinho.innerHTML = html;
    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

function removerItem(idProduto) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const index = carrinho.indexOf(idProduto);
    if (index > -1) {
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        carregarCarrinho();
    }
}

function finalizarCompra() {
    alert("Compra finalizada com sucesso!");
    localStorage.removeItem("carrinho");
    carregarCarrinho();
}

document.addEventListener("DOMContentLoaded", carregarCarrinho);