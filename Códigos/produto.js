document.addEventListener('DOMContentLoaded', () => {

    const bgImg      = document.getElementById('bgImg');
    const relogioImg = document.getElementById('relogioImg');
    const corBtns    = document.querySelectorAll('.cor-btn');
    const btnPreco   = document.querySelector('.produto-preco');

    const btnAtivo = document.querySelector('.cor-btn.active') || corBtns[0];
    let corAtiva   = btnAtivo ? (btnAtivo.dataset.cor || 'default') : 'default';

    corBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            corBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            corAtiva = btn.dataset.cor || 'default';

            const novaBg      = btn.dataset.bg;
            const novoRelogio = btn.dataset.relogio;

            bgImg.style.opacity = '0';
            setTimeout(() => {
                bgImg.src           = novaBg;
                bgImg.style.opacity = '1';
            }, 300);

            relogioImg.style.opacity = '0';
            setTimeout(() => {
                relogioImg.src           = novoRelogio;
                relogioImg.style.opacity = '1';
            }, 300);

        });
    });

    if (btnPreco) {

        const url = window.location.pathname;
        let prodBase = 'axiom';
        if (url.includes('helix')) prodBase = 'helix';
        else if (url.includes('vanta')) prodBase = 'vanta';

        const textoOriginal = btnPreco.textContent;

        btnPreco.addEventListener('click', () => {

            const prodId = corAtiva && corAtiva !== 'default'
                ? `${prodBase}_${corAtiva}`
                : prodBase;

            const corBtn      = document.querySelector('.cor-btn.active');
            const imgCarrinho = corBtn ? corBtn.dataset.imgCarrinho : null;
            const imgSrc      = (imgCarrinho && !imgCarrinho.includes('COLOQUE_AQUI'))
                ? imgCarrinho
                : (corBtn ? corBtn.dataset.relogio : relogioImg.src);
            const corNome     = corBtn ? (corBtn.dataset.corNome || '') : '';

            let carrinho = JSON.parse(sessionStorage.getItem('wb_carrinho') || '[]');

            const existente = carrinho.find(i => i.id === prodId);
            if (existente) {
                existente.qty++;
            } else {
                carrinho.push({
                    id:      prodId,
                    base:    prodBase,
                    cor:     corAtiva,
                    corNome: corNome,
                    img:     imgSrc,
                    qty:     1
                });
            }

            sessionStorage.setItem('wb_carrinho', JSON.stringify(carrinho));

            atualizarBolinha();

            btnPreco.textContent       = '✓ Adicionado';
            btnPreco.style.borderColor = 'rgba(122, 191, 142, 0.8)';
            btnPreco.style.color       = '#7abf8e';
            btnPreco.style.animation   = 'none';

            setTimeout(() => {
                btnPreco.textContent       = textoOriginal;
                btnPreco.style.borderColor = '';
                btnPreco.style.color       = '';
                btnPreco.style.animation   = '';
            }, 1800);

        });
    }

    injetarBolsaFlutuante();

});

function injetarBolsaFlutuante() {
    if (document.querySelector('.bolsa-flutuante')) return;

    const btn = document.createElement('button');
    btn.className = 'bolsa-flutuante';
    btn.setAttribute('aria-label', 'Ver carrinho');
    btn.innerHTML = `<img src="./Relógio elegantes e modernos/Hero/Bolsa.png" alt="Bolsa">`;

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        window.location.href = 'carrinho.html';
    });

    atualizarBolinha();
}

function atualizarBolinha() {
    const btn = document.querySelector('.bolsa-flutuante') || document.querySelector('.bag-btn');
    if (!btn) return;

    const carrinho = JSON.parse(sessionStorage.getItem('wb_carrinho') || '[]');
    const total    = carrinho.reduce((acc, item) => acc + item.qty, 0);

    const existente = btn.querySelector('.bag-badge');
    if (existente) existente.remove();

    if (total > 0) {
        const badge       = document.createElement('span');
        badge.className   = 'bag-badge';
        badge.textContent = total > 9 ? '9+' : total;
        btn.appendChild(badge);
    }
}