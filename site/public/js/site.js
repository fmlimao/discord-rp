var data = {
    pages: {
        'planos-vips': {
            items: {
                '1001': {
                    code: '1001',
                    title: 'VIP Bronze',
                    description: `
                        <ul>
                            <li>Salário: $ 2.500 (durante 30 dias)</li>
                            <li>Bonus: $ 250.000 (apenas no primeiro donate)</li>
                            <li>Bonus: Carro VIP (apenas no primeiro donate)</li>
                        </ul>
                    `,
                    price: 'R$ 25',
                    image: '/assets/img/vips/bronze.png',
                    enable: 1,
                },
                '1002': {
                    code: '1002',
                    title: 'VIP Prata',
                    description: `
                        <ul>
                            <li>Salário: $ 5.500 (durante 30 dias)</li>
                            <li>Bonus: $ 550.000 (apenas no primeiro donate)</li>
                            <li>Bonus: Carro VIP (apenas no primeiro donate)</li>
                        </ul>
                    `,
                    price: 'R$ 50',
                    image: '/assets/img/vips/prata.png',
                    enable: 1,
                },
                '1003': {
                    code: '1003',
                    title: 'VIP Ouro',
                    description: `
                        <ul>
                            <li>Salário: $ 12.000 (durante 30 dias)</li>
                            <li>Bonus: $ 1.200.000 (apenas no primeiro donate)</li>
                            <li>Bonus: Carro VIP (apenas no primeiro donate)</li>
                        </ul>
                    `,
                    price: 'R$ 100',
                    image: '/assets/img/vips/ouro.png',
                    enable: 1,
                },
                '1004': {
                    code: '1004',
                    title: 'VIP Platina',
                    description: `
                        <ul>
                            <li>Salário: $ 19.500 (durante 30 dias)</li>
                            <li>Bonus: $ 1.950.000 (apenas no primeiro donate)</li>
                            <li>Bonus: Carro VIP (apenas no primeiro donate)</li>
                            <li>Bonus: Limpa todos as multas acumuladas (no ato do donate)</li>
                            <li>Bonus: Limpa 1 ADV (no ato do donate)</li>
                        </ul>
                    `,
                    price: 'R$ 150',
                    image: '/assets/img/vips/platina.png',
                    enable: 1,
                },
                '1005': {
                    code: '1005',
                    title: 'VIP Diamante',
                    description: `
                        <ul>
                            <li>Salário: $ 28.000 (durante 30 dias)</li>
                            <li>Bonus: $ 2.800.000 (apenas no primeiro donate)</li>
                            <li>Bonus: Carro VIP (apenas no primeiro donate)</li>
                            <li>Bonus: Carro Loja (apenas no primeiro donate)</li>
                            <li>Bonus: Limpa todos as multas acumuladas (no ato do donate)</li>
                            <li>Bonus: Limpa 2 ADV (no ato do donate)</li>
                        </ul>
                    `,
                    price: 'R$ 200',
                    image: '/assets/img/vips/diamante.png',
                    enable: 1,
                },
                '1006': {
                    code: '1006',
                    title: 'VIP Obsidian',
                    description: `
                        <ul>
                            <li>Salário: $ 45.000 (durante 30 dias)</li>
                            <li>Bonus: $ 4.500.000 (apenas no primeiro donate)</li>
                            <li>Bonus: Carro VIP (apenas no primeiro donate)</li>
                            <li>Bonus: Carro Loja (apenas no primeiro donate)</li>
                            <li>Bonus: Moto Loja (apenas no primeiro donate)</li>
                            <li>Bonus: Limpa todos as multas acumuladas (no ato do donate)</li>
                            <li>Bonus: Remove Ban e todas ADV's (no ato do donate)</li>
                        </ul>
                    `,
                    price: 'R$ 300',
                    image: '/assets/img/vips/obsidian.png',
                    enable: 1,
                },
            },
        },
        'veiculos-vips': {
            items: {
                '4001': { code: '4001', title: 'Em breve...', description: '<p>Em breve...</p>', price: 'R$ ??', image: '/assets/img/veiculos/pacote.png', enable: 0 },
            },
        },
        'dinheiro': {
            items: {
                '5001': { code: '4001', title: 'Em breve...', description: '<p>Em breve...</p>', price: 'R$ ??', image: '/assets/img/dinheiro/cartao.png', enable: 0 },
            },
        },
        'armas': {
            items: {
                '6001': { code: '4001', title: 'Em breve...', description: '<p>Em breve...</p>', price: 'R$ ??', image: '/assets/img/armas/pacote.png', enable: 0 },
            },
        },
        'remover-punicoes': {
            items: {
                '7001': { code: '4001', title: 'Em breve...', description: '<p>Em breve...</p>', price: 'R$ ??', image: '/assets/img/punicoes/1adv.png', enable: 0 },
            },
        },
    },
};

$(function () {

    for (var page_id in data.pages) {
        var page = data.pages[page_id];
        var items = page.items;

        for (var item_id in items) {
            var item = items[item_id];

            var html = `
            <div class="col-xs-6 col-sm-4 col-md-4">
                <div class="panel panel-list">
                    <div class="panel-body">
                        <img src="${item.image}" class="img-responsive">

                        <p class="text-center" style="text-transform: uppercase;">
                            ${item.title}
                        </p>
                    </div>

                    <div class="panel-footer">
                        <div class="row">
                            <div class="col-xs-12">
                                <button class="btn btn-purple btn-block act-open-details" data-page="${page_id}" data-code="${item.code}">Detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            $('.page[data-page=' + page_id + '] > .row').append(html);
        }
    }

    $('.btn-page').off('click').on('click', function (e) {
        e.preventDefault();

        var page = $(this).attr('data-page');

        $('.btn-page').parent().removeClass('active');
        $('.btn-page[data-page=' + page + ']').parent().addClass('active');

        $('.page').removeClass('active');
        $('.page[data-page=' + page + ']').addClass('active');
    });

    $('.act-open-details').off('click').on('click', function () {
        var page = $(this).attr('data-page');
        var code = $(this).attr('data-code');
        var item = data.pages[page].items[code];

        let title = '';
        let html = '';
        if (item.enable) {
            title = `${item.title} - Código ${code}`;
            html = `
                <h3 style="margin-bottom: 20px">Ao escolher este plano, você recebe:</h3>

                ${item.description}

                <br>

                <h4 class="color-logo-1">
                    <b>Valor da doação: ${item.price}</b>
                </h4>

                <br>

                <p>
                    Para realizar a doação, basta ir em nosso servidor
                    do discord, no canal <a href="https://discord.com/channels/765235242600103936/775896151198269450" target="_blank">DONATES</a> e
                    informar o código do item.
                </p>

                <br>

                <p>
                    Copie a mensagem abaixo e cole no canal <a href="https://discord.com/channels/765235242600103936/775896151198269450" target="_blank">DONATES</a>:
                </p>

                <blockquote>
                    Olá, gostaria de fazer o meu donate para o item de código ${code}
                </blockquote>
            `;
        } else {
            title = `${item.title}`;
            html = `<h3 style="margin-bottom: 20px">Em breve mais detalhes...</h3>`;
        }

        $('#modalDetailsLabel').text(title);
        $('#modalDetailsBody').html(html);
        $('#modalDetails').modal();
    });
    // .eq(6).trigger('click');

    setTimeout(function () {
        $('.loading').stop().animate({
            opacity: 0,
        }, 300, function () {
            $('.loading').remove();
        });
    }, 1000);

});