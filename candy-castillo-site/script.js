// script.js - A mágica da Candy's Castillo
(function() {
    "use strict";

    // Número do WhatsApp
    const WHATSAPP = "5551998700161";
    const INSTAGRAM = "https://ig.me/m/candycastillo2026";

    function waLink(msg) {
        return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
    }

    function igLink(msg) {
        return INSTAGRAM + "?text=" + encodeURIComponent(msg);
    }

    // Produtos com combos
    const PRODUTOS = [{
        nome: "Pirulito",
        preco: 1.25,
        desc: "Doce colorido, clássico e que nunca sai de moda.",
        img: "/img/pirulito.jpg",
        badge: "🍭",
        precoCorreio: 1.50,
        tipo: "individual",
        canal: "whatsapp",
        ocasioes: [
            { nome: "Amizade", icone: "🤝" },
            { nome: "Crush", icone: "💕" },
            { nome: "Aniversariante", icone: "🎂" },
            { nome: "Inimigo Elegante", icone: "😈" }
        ]
    }, {
        nome: "Paçoca",
        preco: 1.00,
        desc: "Amendoim puro, aquele sabor que a gente ama.",
        img: "/img/pacoca.jpeg",
        badge: "🥜",
        precoCorreio: 1.25,
        tipo: "individual",
        canal: "whatsapp",
        ocasioes: [
            { nome: "Amizade", icone: "🤝" },
            { nome: "Crush", icone: "💕" },
            { nome: "Aniversariante", icone: "🎂" },
            { nome: "Inimigo Elegante", icone: "😈" }
        ]
    }, {
        nome: "Combo 2 Paçocas + Pirulito",
        preco: 2.50,
        desc: "Duas paçocas e um pirulito — o trio perfeito!",
        img: "/img/combo1.jpg",
        badge: "🎁",
        tipo: "combo",
        canal: "instagram",
        itens: ["2 Paçocas", "1 Pirulito"],
        precoCorreio: null,
        cor: "#f7b731"
    }, {
        nome: "Combo 2 Pirulitos + Paçoca",
        preco: 3.00,
        desc: "Dois pirulitos e uma paçoca — dobro de diversão!",
        img: "/img/combo2.jpg",
        badge: "🎁",
        tipo: "combo",
        canal: "instagram",
        itens: ["2 Pirulitos", "1 Paçoca"],
        precoCorreio: null,
        cor: "#f7b731"
    }];

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloaderProgress');
    let loadProgress = 0;

    function atualizarPreloader() {
        loadProgress += Math.random() * 15 + 3;
        if (loadProgress > 100) loadProgress = 100;
        progress.style.width = loadProgress + '%';
        if (loadProgress < 100) {
            setTimeout(atualizarPreloader, 200 + Math.random() * 300);
        } else {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
                iniciarAnimacoes();
            }, 400);
        }
    }
    document.body.style.overflow = 'hidden';
    atualizarPreloader();

    // ===== POPUP SENAC =====
    const popup = document.getElementById('popupSenac');
    const popupClose = document.getElementById('popupClose');
    const popupEntendi = document.getElementById('popupEntendi');

    function fecharPopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (popupClose) popupClose.addEventListener('click', fecharPopup);
    if (popupEntendi) popupEntendi.addEventListener('click', fecharPopup);
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) fecharPopup();
        });
    }

    // ===== CANVAS =====
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let estrelinhas = [];

        function redimensionarCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
        }
        redimensionarCanvas();
        window.addEventListener('resize', redimensionarCanvas);

        class Estrelinha {
            constructor() { this.resetar(); }
            resetar() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.tamanho = Math.random() * 3 + 1;
                this.velX = (Math.random() - 0.5) * 0.4;
                this.velY = (Math.random() - 0.5) * 0.4;
                this.opacidade = Math.random() * 0.3 + 0.05;
            }
            atualizar() {
                this.x += this.velX;
                this.y += this.velY;
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.resetar();
            }
            desenhar() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 30, 142, ${this.opacidade})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 120; i++) estrelinhas.push(new Estrelinha());

        function animarEstrelinhas() {
            ctx.clearRect(0, 0, width, height);
            estrelinhas.forEach(e => { e.atualizar(); e.desenhar(); });
            requestAnimationFrame(animarEstrelinhas);
        }
        animarEstrelinhas();
    }

    // ===== CONTADORES =====
    function animarContadores() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            if (!target) return;
            let current = 0;
            const increment = target / 60;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const interval = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(interval);
                            }
                            counter.textContent = 'R$ ' + current.toFixed(2).replace('.', ',');
                        }, 20);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(counter);
        });
    }

    // ===== ESTADO DOS PEDIDOS =====
    let pedidoNormal = { produto: null, quantidade: 1 };
    let pedidoCorreioPirulito = { ocasiao: "Amizade", quantidade: 1, mensagem: "" };
    let pedidoCorreioPacoca = { ocasiao: "Amizade", quantidade: 1, mensagem: "" };

    // ===== FUNÇÕES MODAIS =====
    function fecharModal(el) {
        if (!el) return;
        el.classList.remove('active');
        document.body.style.overflow = '';
    }

    function abrirModal(el) {
        if (!el) return;
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function fecharTodosModais() {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
            m.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // ===== MODAL NORMAL =====
    const modalNormal = document.getElementById('modalNormal');
    const modalNormalClose = document.getElementById('modalNormalClose');
    const btnCancelarNormal = document.getElementById('btnCancelarNormal');
    const btnEnviarNormal = document.getElementById('btnEnviarNormal');
    const normalQtyMinus = document.getElementById('normalQtyMinus');
    const normalQtyPlus = document.getElementById('normalQtyPlus');
    const normalQtyValue = document.getElementById('normalQtyValue');
    const normalQtyPrice = document.getElementById('normalQtyPrice');
    const normalResumoProduto = document.getElementById('normalResumoProduto');
    const normalResumoQuantidade = document.getElementById('normalResumoQuantidade');
    const normalResumoTotal = document.getElementById('normalResumoTotal');
    const normalEmoji = document.getElementById('normalEmoji');
    const normalTitulo = document.getElementById('normalTitulo');

    function abrirModalNormal(produto) {
        pedidoNormal.produto = produto;
        pedidoNormal.quantidade = 1;
        normalEmoji.textContent = produto.badge;
        normalTitulo.textContent = produto.nome;
        atualizarResumoNormal();
        abrirModal(modalNormal);
    }

    function fecharModalNormal() { fecharModal(modalNormal); }

    function atualizarResumoNormal() {
        if (!pedidoNormal.produto) return;
        const qtd = pedidoNormal.quantidade;
        const preco = pedidoNormal.produto.preco;
        const total = qtd * preco;
        normalQtyValue.textContent = qtd;
        normalQtyPrice.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
        normalResumoProduto.textContent = pedidoNormal.produto.nome;
        normalResumoQuantidade.textContent = qtd + 'x';
        normalResumoTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    }

    function getMensagemNormal() {
        if (!pedidoNormal.produto) return '';
        const p = pedidoNormal;
        const total = p.quantidade * p.produto.preco;
        let texto = '🍭 Oi, Candy\'s Castillo! Quero fazer um pedido:\n\n';
        texto += '📦 Produto: ' + p.produto.nome + '\n';
        if (p.produto.itens) {
            texto += '📦 Itens: ' + p.produto.itens.join(', ') + '\n';
        }
        texto += '📦 Quantidade: ' + p.quantidade + 'x\n';
        texto += '💰 Total: R$ ' + total.toFixed(2).replace('.', ',') + '\n\n';
        texto += 'Me avisa quando tiver confirmação? Obrigado! ✨';
        return texto;
    }

    function enviarNormal() {
        if (!pedidoNormal.produto) return;
        window.open(waLink(getMensagemNormal()), '_blank');
        fecharModalNormal();
    }

    modalNormalClose.addEventListener('click', fecharModalNormal);
    btnCancelarNormal.addEventListener('click', fecharModalNormal);
    modalNormal.addEventListener('click', function(e) {
        if (e.target === this) fecharModalNormal();
    });
    btnEnviarNormal.addEventListener('click', enviarNormal);

    normalQtyMinus.addEventListener('click', function() {
        if (pedidoNormal.quantidade > 1) { pedidoNormal.quantidade--; atualizarResumoNormal(); }
    });
    normalQtyPlus.addEventListener('click', function() {
        if (pedidoNormal.quantidade < 99) { pedidoNormal.quantidade++; atualizarResumoNormal(); }
    });

    // ===== MODAL CORREIO PIRULITO =====
    const modalCorreioPirulito = document.getElementById('modalCorreioPirulito');
    const modalCorreioPirulitoClose = document.getElementById('modalCorreioPirulitoClose');
    const btnCancelarPirulito = document.getElementById('btnCancelarPirulito');
    const btnEnviarPirulito = document.getElementById('btnEnviarPirulito');
    const pirulitoQtyMinus = document.getElementById('pirulitoQtyMinus');
    const pirulitoQtyPlus = document.getElementById('pirulitoQtyPlus');
    const pirulitoQtyValue = document.getElementById('pirulitoQtyValue');
    const pirulitoMensagem = document.getElementById('pirulitoMensagem');
    const pirulitoCharCount = document.getElementById('pirulitoCharCount');
    const pirulitoResumoOcasiao = document.getElementById('pirulitoResumoOcasiao');
    const pirulitoResumoQuantidade = document.getElementById('pirulitoResumoQuantidade');
    const pirulitoResumoTotal = document.getElementById('pirulitoResumoTotal');
    const pirulitoResumoMensagem = document.getElementById('pirulitoResumoMensagem');

    function abrirModalCorreioPirulito() {
        pedidoCorreioPirulito.ocasiao = "Amizade";
        pedidoCorreioPirulito.quantidade = 1;
        pedidoCorreioPirulito.mensagem = '';
        pirulitoMensagem.value = '';
        pirulitoCharCount.textContent = '0 / 300';
        document.querySelectorAll('#pirulitoOcasioes .correio-opt').forEach(b => b.classList.remove('active'));
        const firstOpt = document.querySelector('#pirulitoOcasioes .correio-opt[data-ocasiao="Amizade"]');
        if (firstOpt) firstOpt.classList.add('active');
        atualizarResumoPirulito();
        abrirModal(modalCorreioPirulito);
    }

    function fecharModalCorreioPirulito() { fecharModal(modalCorreioPirulito); }

    function atualizarResumoPirulito() {
        const qtd = pedidoCorreioPirulito.quantidade;
        const preco = 1.50;
        const total = qtd * preco;
        pirulitoQtyValue.textContent = qtd;
        const ocasiaoObj = PRODUTOS[0].ocasioes.find(o => o.nome === pedidoCorreioPirulito.ocasiao);
        pirulitoResumoOcasiao.textContent = (ocasiaoObj ? ocasiaoObj.icone + ' ' : '') + pedidoCorreioPirulito.ocasiao;
        pirulitoResumoQuantidade.textContent = qtd + 'x';
        pirulitoResumoTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
        const msg = pedidoCorreioPirulito.mensagem.trim();
        pirulitoResumoMensagem.textContent = msg || 'Nenhuma mensagem';
    }

    function getMensagemCorreioPirulito() {
        const p = pedidoCorreioPirulito;
        const total = p.quantidade * 1.50;
        const ocasiaoObj = PRODUTOS[0].ocasioes.find(o => o.nome === p.ocasiao);
        let texto = '🍭 Oi, Candy\'s Castillo! Quero fazer um Correio Elegante:\n\n';
        texto += '📦 Produto: Pirulito 🍭\n';
        texto += '🎯 Ocasião: ' + p.ocasiao + ' ' + (ocasiaoObj ? ocasiaoObj.icone : '') + '\n';
        texto += '📦 Quantidade: ' + p.quantidade + 'x\n';
        texto += '💰 Total: R$ ' + total.toFixed(2).replace('.', ',') + '\n\n';
        if (p.mensagem.trim()) {
            texto += '💝 Mensagem personalizada:\n"' + p.mensagem.trim() + '"\n\n';
        }
        texto += 'Me avisa quando tiver confirmação? Obrigado! ✨';
        return texto;
    }

    function enviarCorreioPirulito() {
        window.open(waLink(getMensagemCorreioPirulito()), '_blank');
        fecharModalCorreioPirulito();
    }

    modalCorreioPirulitoClose.addEventListener('click', fecharModalCorreioPirulito);
    btnCancelarPirulito.addEventListener('click', fecharModalCorreioPirulito);
    modalCorreioPirulito.addEventListener('click', function(e) {
        if (e.target === this) fecharModalCorreioPirulito();
    });
    btnEnviarPirulito.addEventListener('click', enviarCorreioPirulito);

    document.querySelectorAll('#pirulitoOcasioes .correio-opt').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#pirulitoOcasioes .correio-opt').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            pedidoCorreioPirulito.ocasiao = this.dataset.ocasiao;
            atualizarResumoPirulito();
        });
    });

    pirulitoQtyMinus.addEventListener('click', function() {
        if (pedidoCorreioPirulito.quantidade > 1) { pedidoCorreioPirulito.quantidade--; atualizarResumoPirulito(); }
    });
    pirulitoQtyPlus.addEventListener('click', function() {
        if (pedidoCorreioPirulito.quantidade < 99) { pedidoCorreioPirulito.quantidade++; atualizarResumoPirulito(); }
    });

    pirulitoMensagem.addEventListener('input', function() {
        const maxLength = 300;
        if (this.value.length > maxLength) this.value = this.value.slice(0, maxLength);
        pedidoCorreioPirulito.mensagem = this.value;
        pirulitoCharCount.textContent = this.value.length + ' / ' + maxLength;
        pirulitoCharCount.classList.toggle('limit', this.value.length >= maxLength);
        atualizarResumoPirulito();
    });

    // ===== MODAL CORREIO PAÇOCA =====
    const modalCorreioPacoca = document.getElementById('modalCorreioPacoca');
    const modalCorreioPacocaClose = document.getElementById('modalCorreioPacocaClose');
    const btnCancelarPacoca = document.getElementById('btnCancelarPacoca');
    const btnEnviarPacoca = document.getElementById('btnEnviarPacoca');
    const pacocaQtyMinus = document.getElementById('pacocaQtyMinus');
    const pacocaQtyPlus = document.getElementById('pacocaQtyPlus');
    const pacocaQtyValue = document.getElementById('pacocaQtyValue');
    const pacocaMensagem = document.getElementById('pacocaMensagem');
    const pacocaCharCount = document.getElementById('pacocaCharCount');
    const pacocaResumoOcasiao = document.getElementById('pacocaResumoOcasiao');
    const pacocaResumoQuantidade = document.getElementById('pacocaResumoQuantidade');
    const pacocaResumoTotal = document.getElementById('pacocaResumoTotal');
    const pacocaResumoMensagem = document.getElementById('pacocaResumoMensagem');

    function abrirModalCorreioPacoca() {
        pedidoCorreioPacoca.ocasiao = "Amizade";
        pedidoCorreioPacoca.quantidade = 1;
        pedidoCorreioPacoca.mensagem = '';
        pacocaMensagem.value = '';
        pacocaCharCount.textContent = '0 / 300';
        document.querySelectorAll('#pacocaOcasioes .correio-opt').forEach(b => b.classList.remove('active'));
        const firstOpt = document.querySelector('#pacocaOcasioes .correio-opt[data-ocasiao="Amizade"]');
        if (firstOpt) firstOpt.classList.add('active');
        atualizarResumoPacoca();
        abrirModal(modalCorreioPacoca);
    }

    function fecharModalCorreioPacoca() { fecharModal(modalCorreioPacoca); }

    function atualizarResumoPacoca() {
        const qtd = pedidoCorreioPacoca.quantidade;
        const preco = 1.25;
        const total = qtd * preco;
        pacocaQtyValue.textContent = qtd;
        const ocasiaoObj = PRODUTOS[1].ocasioes.find(o => o.nome === pedidoCorreioPacoca.ocasiao);
        pacocaResumoOcasiao.textContent = (ocasiaoObj ? ocasiaoObj.icone + ' ' : '') + pedidoCorreioPacoca.ocasiao;
        pacocaResumoQuantidade.textContent = qtd + 'x';
        pacocaResumoTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
        const msg = pedidoCorreioPacoca.mensagem.trim();
        pacocaResumoMensagem.textContent = msg || 'Nenhuma mensagem';
    }

    function getMensagemCorreioPacoca() {
        const p = pedidoCorreioPacoca;
        const total = p.quantidade * 1.25;
        const ocasiaoObj = PRODUTOS[1].ocasioes.find(o => o.nome === p.ocasiao);
        let texto = '🥜 Oi, Candy\'s Castillo! Quero fazer um Correio Elegante:\n\n';
        texto += '📦 Produto: Paçoca 🥜\n';
        texto += '🎯 Ocasião: ' + p.ocasiao + ' ' + (ocasiaoObj ? ocasiaoObj.icone : '') + '\n';
        texto += '📦 Quantidade: ' + p.quantidade + 'x\n';
        texto += '💰 Total: R$ ' + total.toFixed(2).replace('.', ',') + '\n\n';
        if (p.mensagem.trim()) {
            texto += '💝 Mensagem personalizada:\n"' + p.mensagem.trim() + '"\n\n';
        }
        texto += 'Me avisa quando tiver confirmação? Obrigado! ✨';
        return texto;
    }

    function enviarCorreioPacoca() {
        window.open(waLink(getMensagemCorreioPacoca()), '_blank');
        fecharModalCorreioPacoca();
    }

    modalCorreioPacocaClose.addEventListener('click', fecharModalCorreioPacoca);
    btnCancelarPacoca.addEventListener('click', fecharModalCorreioPacoca);
    modalCorreioPacoca.addEventListener('click', function(e) {
        if (e.target === this) fecharModalCorreioPacoca();
    });
    btnEnviarPacoca.addEventListener('click', enviarCorreioPacoca);

    document.querySelectorAll('#pacocaOcasioes .correio-opt').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#pacocaOcasioes .correio-opt').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            pedidoCorreioPacoca.ocasiao = this.dataset.ocasiao;
            atualizarResumoPacoca();
        });
    });

    pacocaQtyMinus.addEventListener('click', function() {
        if (pedidoCorreioPacoca.quantidade > 1) { pedidoCorreioPacoca.quantidade--; atualizarResumoPacoca(); }
    });
    pacocaQtyPlus.addEventListener('click', function() {
        if (pedidoCorreioPacoca.quantidade < 99) { pedidoCorreioPacoca.quantidade++; atualizarResumoPacoca(); }
    });

    pacocaMensagem.addEventListener('input', function() {
        const maxLength = 300;
        if (this.value.length > maxLength) this.value = this.value.slice(0, maxLength);
        pedidoCorreioPacoca.mensagem = this.value;
        pacocaCharCount.textContent = this.value.length + ' / ' + maxLength;
        pacocaCharCount.classList.toggle('limit', this.value.length >= maxLength);
        atualizarResumoPacoca();
    });

    // ===== RENDERIZA PRODUTOS =====
    function renderizarProdutos() {
        const grid = document.getElementById("produtos-grid");
        if (!grid) return;

        PRODUTOS.forEach(function(p, index) {
            const card = document.createElement("article");
            card.className = "product-card reveal";
            card.style.transitionDelay = (index * 0.12) + 's';

            let isCombo = p.tipo === "combo";

            let actionsHtml = '';
            if (isCombo) {
                const msg = '🎁 Oi, Candy\'s Castillo! Quero o ' + p.nome + ' (R$ ' + p.preco.toFixed(2).replace('.', ',') + ')!';
                actionsHtml = `
                    <a href="${igLink(msg)}" target="_blank" rel="noopener" class="btn btn-combo btn-block" data-produto="${p.nome}">
                        <span class="combo-emoji">📸</span> Quero esse combo no Instagram
                    </a>
                `;
            } else {
                actionsHtml = `
                    <button class="btn btn-secondary btn-block btn-normal" data-produto="${p.nome}">
                        🛒 Quero esse
                    </button>
                    <button class="btn btn-primary btn-block btn-correio" data-produto="${p.nome}">
                        📨 Correio Elegante
                    </button>
                `;
            }

            card.innerHTML = `
                <div class="product-img">
                    <img src="${p.img}" alt="${p.nome} da Candy's Castillo" loading="lazy" />
                    <span class="product-badge">${p.badge}</span>
                    ${isCombo ? `<span class="product-badge" style="left:auto;right:14px;background:rgba(247,183,49,0.2);color:#f7b731;">📸 Instagram</span>` : ''}
                </div>
                <div class="product-header">
                    <div>
                        <h3 class="product-name">${p.nome}</h3>
                        <p class="product-desc">${p.desc}</p>
                        ${p.itens ? `<p class="product-desc" style="font-size:0.8rem;color:var(--pink);">📦 ${p.itens.join(' + ')}</p>` : ''}
                    </div>
                    <span class="product-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="product-actions">
                    ${actionsHtml}
                </div>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll('.btn-normal').forEach(btn => {
            btn.addEventListener('click', function() {
                const nome = this.dataset.produto;
                const produto = PRODUTOS.find(p => p.nome === nome);
                if (produto) abrirModalNormal(produto);
            });
        });

        document.querySelectorAll('.btn-correio').forEach(btn => {
            btn.addEventListener('click', function() {
                const nome = this.dataset.produto;
                if (nome === 'Pirulito') {
                    abrirModalCorreioPirulito();
                } else if (nome === 'Paçoca') {
                    abrirModalCorreioPacoca();
                }
            });
        });
    }

    // ===== INICIA TUDO =====
    function iniciarAnimacoes() {
        animarContadores();
        renderizarProdutos();

        // Botões de contato
        const btnWhats = document.querySelector('.btn-wa');
        const btnInstagram = document.getElementById('btnContatoInstagram');

        if (btnWhats) {
            btnWhats.setAttribute('href', 'https://wa.me/5551998700161');
        }

        if (btnInstagram) {
            btnInstagram.setAttribute('href', 'https://ig.me/m/candycastillo2026');
        }

        // Links com data-wa
        document.querySelectorAll("[data-wa]").forEach(el => {
            el.setAttribute("href", waLink(el.getAttribute("data-wa")));
        });

        const header = document.getElementById('header');
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 40);
        });

        const hamburger = document.getElementById('hamburger');
        const nav = document.getElementById('nav');
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                nav.classList.toggle('open');
                hamburger.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('open');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        const revealItems = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseFloat(entry.target.style.transitionDelay) || 0;
                        setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.06, rootMargin: '0px 0px -100px 0px' });
            revealItems.forEach(el => observer.observe(el));
        } else {
            revealItems.forEach(el => el.classList.add('visible'));
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                fecharTodosModais();
                if (popup.classList.contains('active')) fecharPopup();
            }
            if (e.key === 'Enter') {
                if (modalNormal.classList.contains('active')) enviarNormal();
                if (modalCorreioPirulito.classList.contains('active')) enviarCorreioPirulito();
                if (modalCorreioPacoca.classList.contains('active')) enviarCorreioPacoca();
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ===== EXPORTA =====
    window.abrirModalNormal = abrirModalNormal;
    window.fecharModalNormal = fecharModalNormal;
    window.abrirModalCorreioPirulito = abrirModalCorreioPirulito;
    window.fecharModalCorreioPirulito = fecharModalCorreioPirulito;
    window.abrirModalCorreioPacoca = abrirModalCorreioPacoca;
    window.fecharModalCorreioPacoca = fecharModalCorreioPacoca;
    window.fecharTodosModais = fecharTodosModais;
    window.fecharPopup = fecharPopup;

})();