/* ============================================
   W.B. CHRONOS — carrinho.js
   ============================================ */

// ── CATÁLOGO BASE ─────────────────────────────────────────────────────────────
// Usado como fallback e para pegar nome/preço/ref por produto base

const CATALOGO_BASE = {
    axiom: {
        nome:  'Axiom One',
        ref:   'Ref. AX-001',
        preco: 12800,
    },
    helix: {
        nome:  'Helix Noir',
        ref:   'Ref. HN-317',
        preco: 12000,
    },
    vanta: {
        nome:  'Vanta Steel',
        ref:   'Ref. VS-204',
        preco: 10500,
    }
};

// ── IMAGENS POR COR ───────────────────────────────────────────────────────────
// Estrutura: IMAGENS[prodBase][cor] = caminho da imagem
// Substitua os caminhos pelas suas imagens quando tiver

const IMAGENS = {
    axiom: {
        default: './Relógio elegantes e modernos/Seção 4/Axiom One.jpg',
        default: './Relógio elegantes e modernos/Seção 4/Axiom One - verde.png'
        // preto: './Relógio elegantes e modernos/Seção 4/Axiom One Preto.jpg',
    },
    helix: {
        default: './Relógio elegantes e modernos/Seção 4/Helix Noir.jpg',
        // dourado: './Relógio elegantes e modernos/Seção 4/Helix Noir Dourado.jpg',
        // prata:   './Relógio elegantes e modernos/Seção 4/Helix Noir Prata.jpg',
    },
    vanta: {
        default: './Relógio elegantes e modernos/Seção 4/Vanta Steel.jpg',
        // verde:  './Relógio elegantes e modernos/Seção 4/Vanta Steel Verde.jpg',
        // cobre:  './Relógio elegantes e modernos/Seção 4/Vanta Steel Cobre.jpg',
    }
};

// ── CUPONS VÁLIDOS ────────────────────────────────────────────────────────────

const CUPONS = {
    'WB10':      0.10,
    'CHRONOS15': 0.15,
    'LUXO20':    0.20
};

// ── ESTADO ───────────────────────────────────────────────────────────────────

let carrinho      = JSON.parse(sessionStorage.getItem('wb_carrinho') || '[]');
let descontoAtivo = 0;
let timerInterval = null;

// ── UTILITÁRIOS ──────────────────────────────────────────────────────────────

function salvar() {
    sessionStorage.setItem('wb_carrinho', JSON.stringify(carrinho));
}

function formatarPreco(valor) {
    return 'R$ ' + valor.toLocaleString('pt-BR');
}

function getProduto(item) {
    // Pega dados base pelo campo 'base' ou pelo id direto
    const base = item.base || item.id;
    return CATALOGO_BASE[base] || null;
}

function getImagem(item) {
    // Se o item tem imagem salva (vinda do produto.js), usa ela
    if (item.img) return item.img;

    // Senão tenta pegar do IMAGENS pelo base + cor
    const base = item.base || item.id;
    const cor  = item.cor || 'default';
    return (IMAGENS[base] && IMAGENS[base][cor])
        ? IMAGENS[base][cor]
        : (IMAGENS[base] ? IMAGENS[base].default : '');
}

function calcularSubtotal() {
    return carrinho.reduce((total, item) => {
        const produto = getProduto(item);
        return total + (produto ? produto.preco * item.qty : 0);
    }, 0);
}

// ── RENDERIZAR LISTA ──────────────────────────────────────────────────────────

function renderLista() {
    const lista = document.getElementById('carrinhoLista');
    const vazio = document.getElementById('carrinhoVazio');

    lista.innerHTML = '';

    if (carrinho.length === 0) {
        vazio.classList.add('visivel');
        return;
    }

    vazio.classList.remove('visivel');

    carrinho.forEach((item, idx) => {
        const produto = getProduto(item);
        if (!produto) return;

        const img       = getImagem(item);
        const totalItem = produto.preco * item.qty;
        const corLabel  = item.corNome ? ` — ${item.corNome}` : '';

        const div = document.createElement('div');
        div.className = 'carrinho-item';

        div.innerHTML = `
            <button class="item-remover" data-idx="${idx}" title="Remover item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6"  x2="6"  y2="18"></line>
                    <line x1="6"  y1="6"  x2="18" y2="18"></line>
                </svg>
            </button>

            <img class="item-img" src="${img}" alt="${produto.nome}">

            <div class="item-info">
                <span class="item-nome">${produto.nome}${corLabel}</span>
                <span class="item-ref">${produto.ref}</span>
            </div>

            <div class="item-quantidade">
                <button class="qty-btn" data-idx="${idx}" data-acao="dec">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" data-idx="${idx}" data-acao="inc">+</button>
            </div>

            <div class="item-preco">
                <span class="item-preco-bold">${formatarPreco(totalItem)}</span>
                <span class="item-preco-sub">${totalItem.toLocaleString('pt-BR')}</span>
            </div>
        `;

        lista.appendChild(div);
    });
}

// ── ATUALIZAR RESUMO ──────────────────────────────────────────────────────────

function atualizarResumo() {
    const subtotal  = calcularSubtotal();
    const desconto  = Math.round(subtotal * descontoAtivo);
    const total     = subtotal - desconto;

    document.getElementById('resumoSubtotal').textContent = formatarPreco(subtotal);
    document.getElementById('resumoTotal').textContent    = formatarPreco(total);

    const linhaDesconto = document.getElementById('descontoLinha');

    if (desconto > 0) {
        linhaDesconto.style.display = 'flex';
        document.getElementById('resumoDesconto').textContent = '− ' + formatarPreco(desconto);
    } else {
        linhaDesconto.style.display = 'none';
    }
}

function render() {
    renderLista();
    atualizarResumo();
}

// ── REMOVER ITEM ──────────────────────────────────────────────────────────────

function removerItem(idx) {
    carrinho.splice(idx, 1);
    salvar();
    render();
}

// ── ALTERAR QUANTIDADE ────────────────────────────────────────────────────────

function alterarQty(idx, acao) {
    if (acao === 'inc') {
        carrinho[idx].qty++;
    } else if (acao === 'dec') {
        if (carrinho[idx].qty > 1) {
            carrinho[idx].qty--;
        } else {
            removerItem(idx);
            return;
        }
    }
    salvar();
    render();
}

// ── EVENTOS DELEGADOS NA LISTA ────────────────────────────────────────────────

document.getElementById('carrinhoLista').addEventListener('click', e => {

    const btnRemover = e.target.closest('.item-remover');
    if (btnRemover) {
        removerItem(parseInt(btnRemover.dataset.idx));
        return;
    }

    const btnQty = e.target.closest('.qty-btn');
    if (btnQty) {
        alterarQty(parseInt(btnQty.dataset.idx), btnQty.dataset.acao);
    }

});

// ── CUPOM PROMOCIONAL ─────────────────────────────────────────────────────────

document.getElementById('cupomBtn').addEventListener('click', () => {
    const codigo = document.getElementById('cupomInput').value.trim().toUpperCase();
    const msgEl  = document.getElementById('cupomMsg');

    if (CUPONS[codigo]) {
        descontoAtivo       = CUPONS[codigo];
        msgEl.className     = 'cupom-msg ok';
        msgEl.textContent   = `Cupom aplicado! ${descontoAtivo * 100}% de desconto.`;
    } else {
        descontoAtivo       = 0;
        msgEl.className     = 'cupom-msg err';
        msgEl.textContent   = 'Código inválido ou expirado.';
    }

    atualizarResumo();
});

// ── FINALIZAR COMPRA ──────────────────────────────────────────────────────────

document.getElementById('btnFinalizar').addEventListener('click', () => {

    if (carrinho.length === 0) {
        const btn = document.getElementById('btnFinalizar');
        btn.textContent       = 'Adicione um produto primeiro';
        btn.style.background  = 'transparent';
        btn.style.color       = '#bf7a7a';
        btn.style.border      = '1px solid rgba(191,122,122,0.4)';
        setTimeout(() => {
            btn.textContent      = 'Finalizar Compra';
            btn.style.background = '';
            btn.style.color      = '';
            btn.style.border     = '';
        }, 2000);
        return;
    }

    const subtotal = calcularSubtotal();
    const desconto = Math.round(subtotal * descontoAtivo);
    const total    = subtotal - desconto;

    document.getElementById('modalValor').textContent = formatarPreco(total);

    document.getElementById('modalPix').style.display         = 'flex';
    document.getElementById('modalConfirmacao').style.display = 'none';

    document.getElementById('modalOverlay').classList.add('ativo');

    iniciarTimer();

});

// ── TIMER REGRESSIVO ──────────────────────────────────────────────────────────

function iniciarTimer() {
    clearInterval(timerInterval);

    let segundos = 15 * 60;
    const display = document.getElementById('timerDisplay');

    function atualizar() {
        const min = Math.floor(segundos / 60);
        const sec = segundos % 60;
        display.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        if (segundos <= 120) {
            display.classList.add('urgente');
        } else {
            display.classList.remove('urgente');
        }

        if (segundos === 0) clearInterval(timerInterval);

        segundos--;
    }

    atualizar();
    timerInterval = setInterval(atualizar, 1000);
}

// ── CONFIRMAR PAGAMENTO ───────────────────────────────────────────────────────

document.getElementById('btnConfirmarPagamento').addEventListener('click', () => {

    clearInterval(timerInterval);

    const subtotal = calcularSubtotal();
    const desconto = Math.round(subtotal * descontoAtivo);
    const total    = subtotal - desconto;

    const numPedido = '#' + Math.floor(10000000 + Math.random() * 90000000);

    const agora   = new Date();
    const dia     = String(agora.getDate()).padStart(2, '0');
    const mes     = String(agora.getMonth() + 1).padStart(2, '0');
    const ano     = agora.getFullYear();
    const horas   = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const dataStr = `${dia}/${mes}/${ano} — ${horas}:${minutos}`;

    document.getElementById('numeroPedido').textContent     = numPedido;
    document.getElementById('dataConfirmacao').textContent  = dataStr;
    document.getElementById('totalConfirmacao').textContent = formatarPreco(total);

    document.getElementById('modalPix').style.display         = 'none';
    document.getElementById('modalConfirmacao').style.display = 'flex';

});

// ── VOLTAR À LOJA ─────────────────────────────────────────────────────────────

document.getElementById('btnVoltarLoja').addEventListener('click', () => {

    carrinho = [];
    salvar();

    document.getElementById('modalOverlay').classList.remove('ativo');
    clearInterval(timerInterval);

    window.location.href = 'index.html';

});

// ── INICIALIZAR ───────────────────────────────────────────────────────────────

render();