document.addEventListener('DOMContentLoaded', () => {

    const savedScroll = sessionStorage.getItem('scrollY');
    if (savedScroll) {
        document.body.classList.add('unlocked');
        setTimeout(() => {
            window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
            sessionStorage.removeItem('scrollY');
        }, 50);
    }

    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            document.body.classList.add('unlocked');
            const colecao = document.getElementById('colecao');
            if (colecao) {
                setTimeout(() => colecao.scrollIntoView({ behavior: 'smooth' }), 50);
            }
        });
    }

    document.querySelectorAll('.ver-produto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('scrollY', window.scrollY);
        });
    });

    const bagBtn = document.querySelector('.bag-btn');
    if (bagBtn) {
        bagBtn.classList.add('pulse-icon');

        bagBtn.addEventListener('click', () => {
            sessionStorage.setItem('scrollY', window.scrollY);
            window.location.href = 'carrinho.html';
        });

        atualizarBolinha();
    }

});

function atualizarBolinha() {
    const btn = document.querySelector('.bag-btn') || document.querySelector('.bolsa-flutuante');
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

document.querySelectorAll('.relogio-img-wrap').forEach(wrap => {
    const imgs = wrap.querySelectorAll('img');
    let interval = null;
    let current  = 0;

    function showFrame(index) {
        imgs.forEach(img => img.classList.remove('active'));
        imgs[index].classList.add('active');
    }

    wrap.addEventListener('mouseenter', () => {
        interval = setInterval(() => {
            current = (current + 1) % imgs.length;
            showFrame(current);
        }, 800);
    });

    wrap.addEventListener('mouseleave', () => {
        clearInterval(interval);
        current = 0;
        showFrame(0);
    });
});

document.querySelector('.rodape-link-bold').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('modalGarantia').classList.add('ativo');
});

document.getElementById('btnFecharGarantia').addEventListener('click', () => {
    document.getElementById('modalGarantia').classList.remove('ativo');
});

document.getElementById('modalGarantia').addEventListener('click', e => {
    if (e.target === document.getElementById('modalGarantia')) {
        document.getElementById('modalGarantia').classList.remove('ativo');
    }
});

document.querySelectorAll('.rodape-link')[1].addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('modalFaq').classList.add('ativo');
});

document.getElementById('btnFecharFaq').addEventListener('click', () => {
    document.getElementById('modalFaq').classList.remove('ativo');
});

document.getElementById('modalFaq').addEventListener('click', e => {
    if (e.target === document.getElementById('modalFaq')) {
        document.getElementById('modalFaq').classList.remove('ativo');
    }
});

document.querySelectorAll('.faq-pergunta').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const jaAberto = item.classList.contains('aberto');

        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('aberto'));

        if (!jaAberto) item.classList.add('aberto');
    });
});