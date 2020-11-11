/*

Planos



Bronze
    Salario a mais
    Bonus na primeira compra
    Carro VIP

Prata
    Salario a mais
    Bonus na primeira compra
    Carro VIP

Ouro
    Salario a mais
    Bonus na primeira compra
    Carro VIP

Planita
    Salario a mais
    Bonus na primeira compra
    Carro VIP
    Limpa todos as multas acumuladas
    1 ADV

Diamante
    Salario a mais
    Bonus na primeira compra
    Carro VIP
    Carro Loja
    Moto Loja
    Limpa todos as multas acumuladas
    2 ADV

Obsidian
    Salario a mais
    Bonus na primeira compra
    Carro VIP
    Carro Loja
    Moto Loja
    Limpa todos as multas acumuladas
    Remove Ban e todas ADV's

*/

var data = {
    pages: {
        'planos-vips': {
            items: {
                '3001': { code: '3001', title: 'Plano 1', description: '<p>Descrição do plano 1</p><p>Cupidatat adipisicing culpa quis fugiat duis ipsum nostrud quis amet culpa aliqua aliqua irure.</p><p>Ut tempor irure tempor commodo.</p>', price: 'R$ 19,99/mês', image: '/assets/img/vips/bronze.png' },
                '3002': { code: '3002', title: 'Plano 2', description: '<p>Descrição do plano 2</p><p>Est eiusmod do nostrud in ut fugiat.</p><p>Anim ea voluptate anim magna voluptate ipsum quis ea dolor.</p>', price: 'R$ 29,99/mês', image: '/assets/img/vips/bronze.png' },
                '3003': { code: '3003', title: 'Plano 3', description: '<p>Descrição do plano 3</p><p>Nostrud irure esse sit nisi minim enim culpa.</p><p>Et sunt sint ex sint dolore do do adipisicing magna aliquip eu consectetur.</p>', price: 'R$ 39,99/mês', image: '/assets/img/vips/bronze.png' },
                '3004': { code: '3004', title: 'Plano 4', description: '<p>Descrição do plano 4</p><p>Occaecat aliquip labore dolore exercitation tempor non consequat elit elit occaecat irure dolor.</p><p>Ut sit esse nulla qui ea labore incididunt ullamco qui velit.</p>', price: 'R$ 49,99/mês', image: '/assets/img/vips/bronze.png' },
                '3005': { code: '3005', title: 'Plano 5', description: '<p>Descrição do plano 5</p><p>Aute non ex cupidatat do consectetur esse nulla aute.</p><p>Incididunt mollit exercitation sit consectetur commodo aliquip enim eu qui.</p>', price: 'R$ 59,99/mês', image: '/assets/img/vips/bronze.png' },
                '3006': { code: '3006', title: 'Plano 6', description: '<p>Descrição do plano 6</p><p>Veniam consequat in Lorem do qui.</p><p>Fugiat pariatur tempor irure est.</p>', price: 'R$ 69,99/mês', image: '/assets/img/vips/bronze.png' },
                '3007': { code: '3007', title: 'Plano 7', description: '<p>Descrição do plano 7</p><p>Esse quis amet fugiat eu officia quis fugiat consectetur amet incididunt incididunt.</p><p>Et et cupidatat dolor nisi.</p>', price: 'R$ 79,99/mês', image: '/assets/img/vips/bronze.png' },
                '3008': { code: '3008', title: 'Plano 8', description: '<p>Descrição do plano 8</p><p>Laborum sit nisi enim magna qui qui proident reprehenderit fugiat in laboris duis adipisicing.</p><p>Anim enim quis do aliqua pariatur excepteur in in minim dolor officia.</p>', price: 'R$ 89,99/mês', image: '/assets/img/vips/bronze.png' },
                '3009': { code: '3009', title: 'Plano 9', description: '<p>Descrição do plano 9</p><p>Ullamco voluptate duis adipisicing laboris proident pariatur.</p><p>Dolore cupidatat Lorem laboris officia consectetur cupidatat cillum enim culpa anim veniam cupidatat.</p>', price: 'R$ 99,99/mês', image: '/assets/img/vips/bronze.png' },
                '3010': { code: '3010', title: 'Plano 10', description: '<p>Descrição do plano 10</p><p>Irure anim anim laboris eiusmod veniam.</p><p>Duis consequat nulla eiusmod non do occaecat velit adipisicing.</p>', price: 'R$ 109,99/mês', image: '/assets/img/vips/bronze.png' },
            },
        },
        'veiculos-vips': {
            items: {
                '4001': { code: '4001', title: 'Veículo 1', description: '<p>Descrição do veículo 1</p><p>Tempor magna proident pariatur laboris cillum reprehenderit culpa ut nisi.</p><p>In irure anim Lorem ea culpa voluptate pariatur commodo adipisicing consequat eiusmod.</p>', price: 'R$ 19,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4002': { code: '4002', title: 'Veículo 2', description: '<p>Descrição do veículo 2</p><p>Et sit cillum velit irure fugiat est aute sit aute cupidatat nostrud anim.</p><p>Pariatur nostrud deserunt sit pariatur eiusmod laborum consectetur non culpa enim amet.</p>', price: 'R$ 29,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4003': { code: '4003', title: 'Veículo 3', description: '<p>Descrição do veículo 3</p><p>Ex voluptate aliquip dolor aliquip adipisicing exercitation officia nostrud deserunt eu esse dolore exercitation.</p><p>Proident fugiat pariatur ipsum eu velit Lorem velit fugiat in enim aute nulla do.</p>', price: 'R$ 39,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4004': { code: '4004', title: 'Veículo 4', description: '<p>Descrição do veículo 4</p><p>Dolor ea proident aute sint adipisicing adipisicing adipisicing commodo incididunt aute deserunt nostrud.</p><p>Anim incididunt ex excepteur nisi fugiat ipsum ipsum amet laborum culpa sint id tempor.</p>', price: 'R$ 49,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4005': { code: '4005', title: 'Veículo 5', description: '<p>Descrição do veículo 5</p><p>Culpa adipisicing velit pariatur anim aliqua laborum.</p><p>Consequat enim quis officia irure pariatur.</p>', price: 'R$ 59,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4006': { code: '4006', title: 'Veículo 6', description: '<p>Descrição do veículo 6</p><p>Qui nulla voluptate labore esse aliquip minim exercitation adipisicing laborum anim magna minim eiusmod.</p><p>Irure do minim ex laboris consequat proident nostrud minim non sint exercitation aute.</p>', price: 'R$ 69,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4007': { code: '4007', title: 'Veículo 7', description: '<p>Descrição do veículo 7</p><p>Elit pariatur irure consequat quis sit.</p><p>In dolor id anim elit officia ullamco non dolore enim.</p>', price: 'R$ 79,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4008': { code: '4008', title: 'Veículo 8', description: '<p>Descrição do veículo 8</p><p>Eiusmod cupidatat et quis minim nisi Lorem.</p><p>Mollit in fugiat aliquip occaecat in non qui.</p>', price: 'R$ 89,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4009': { code: '4009', title: 'Veículo 9', description: '<p>Descrição do veículo 9</p><p>Id ex adipisicing consectetur incididunt ex consectetur reprehenderit ut labore dolor et nulla.</p><p>Lorem ipsum mollit reprehenderit commodo et mollit non aliqua enim dolore.</p>', price: 'R$ 99,99/mês', image: '/assets/img/veiculos/pacote.png' },
                '4010': { code: '4010', title: 'Veículo 10', description: '<p>Descrição do veículo 10</p><p>Minim voluptate non incididunt sit est do consectetur.</p><p>Nostrud ex voluptate laboris ad labore veniam fugiat nisi elit.</p>', price: 'R$ 109,99/mês', image: '/assets/img/veiculos/pacote.png' },
            },
        },
        'dinheiro': {
            items: {
                '5001': { code: '5001', title: 'Dinheiro 1', description: '<p>Descrição do dinheiro 1</p><p>Sit commodo labore duis consectetur dolor duis sunt eu tempor dolor excepteur reprehenderit do.</p><p>Elit ea sit aliqua quis ad irure.</p>', price: 'R$ 19,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5002': { code: '5002', title: 'Dinheiro 2', description: '<p>Descrição do dinheiro 2</p><p>Anim magna dolor excepteur laboris dolore commodo.</p><p>Adipisicing commodo esse quis proident ad sint aute labore amet.</p>', price: 'R$ 29,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5003': { code: '5003', title: 'Dinheiro 3', description: '<p>Descrição do dinheiro 3</p><p>Ipsum Lorem anim ullamco pariatur cupidatat sunt dolor voluptate.</p><p>Nisi aute sit occaecat est deserunt velit sunt amet veniam sunt sit reprehenderit.</p>', price: 'R$ 39,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5004': { code: '5004', title: 'Dinheiro 4', description: '<p>Descrição do dinheiro 4</p><p>Non et do irure laboris amet exercitation do velit velit ullamco mollit proident.</p><p>Anim duis enim minim sunt.</p>', price: 'R$ 49,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5005': { code: '5005', title: 'Dinheiro 5', description: '<p>Descrição do dinheiro 5</p><p>Eu nostrud magna voluptate magna aliqua aute cupidatat officia occaecat culpa esse anim.</p><p>Sit enim qui ad non.</p>', price: 'R$ 59,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5006': { code: '5006', title: 'Dinheiro 6', description: '<p>Descrição do dinheiro 6</p><p>Fugiat commodo do culpa dolore dolor tempor voluptate.</p><p>Qui veniam esse reprehenderit elit nisi culpa laboris ex commodo.</p>', price: 'R$ 69,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5007': { code: '5007', title: 'Dinheiro 7', description: '<p>Descrição do dinheiro 7</p><p>Cupidatat commodo id exercitation labore.</p><p>Consequat dolor cupidatat exercitation quis ex anim do.</p>', price: 'R$ 79,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5008': { code: '5008', title: 'Dinheiro 8', description: '<p>Descrição do dinheiro 8</p><p>Excepteur nostrud dolor exercitation exercitation.</p><p>Sint deserunt fugiat enim reprehenderit consectetur enim ipsum ut ut est fugiat dolor.</p>', price: 'R$ 89,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5009': { code: '5009', title: 'Dinheiro 9', description: '<p>Descrição do dinheiro 9</p><p>Ex aliquip ad ad occaecat irure culpa consectetur commodo.</p><p>Ex consequat voluptate laborum est excepteur excepteur aliqua aliqua.</p>', price: 'R$ 99,99/mês', image: '/assets/img/dinheiro/cartao.png' },
                '5010': { code: '5010', title: 'Dinheiro 10', description: '<p>Descrição do dinheiro 10</p><p>Tempor nostrud ex cupidatat qui magna ullamco.</p><p>Occaecat qui ullamco laboris ex nulla adipisicing reprehenderit esse anim et in.</p>', price: 'R$ 109,99/mês', image: '/assets/img/dinheiro/cartao.png' },
            },
        },
        'armas': {
            items: {
                '6001': { code: '6001', title: 'Arma 1', description: '<p>Descrição do arma 1</p><p>Do amet minim cupidatat tempor ad mollit aliqua.</p><p>Labore laboris minim aute nulla excepteur.</p>', price: 'R$ 19,99/mês', image: '/assets/img/armas/pacote.png' },
                '6002': { code: '6002', title: 'Arma 2', description: '<p>Descrição do arma 2</p><p>Laborum aliquip deserunt commodo labore non ea eiusmod.</p><p>Duis sint reprehenderit exercitation sunt velit tempor dolor commodo mollit laboris sunt minim aute ad.</p>', price: 'R$ 29,99/mês', image: '/assets/img/armas/pacote.png' },
                '6003': { code: '6003', title: 'Arma 3', description: '<p>Descrição do arma 3</p><p>Cupidatat aliquip irure officia excepteur nostrud nulla nisi pariatur.</p><p>Consectetur in proident et labore nisi eu sunt aute qui dolore occaecat.</p>', price: 'R$ 39,99/mês', image: '/assets/img/armas/pacote.png' },
                '6004': { code: '6004', title: 'Arma 4', description: '<p>Descrição do arma 4</p><p>Occaecat ipsum cillum culpa Lorem mollit ullamco dolore ex est elit reprehenderit velit veniam eiusmod.</p><p>Ipsum non ex dolore esse exercitation pariatur commodo qui dolore fugiat ullamco nostrud culpa laborum.</p>', price: 'R$ 49,99/mês', image: '/assets/img/armas/pacote.png' },
                '6005': { code: '6005', title: 'Arma 5', description: '<p>Descrição do arma 5</p><p>Minim nisi et do labore ut tempor veniam esse incididunt.</p><p>Lorem anim laborum irure velit ipsum duis velit aute fugiat ullamco ullamco ullamco duis.</p>', price: 'R$ 59,99/mês', image: '/assets/img/armas/pacote.png' },
                '6006': { code: '6006', title: 'Arma 6', description: '<p>Descrição do arma 6</p><p>Est officia nulla anim nulla laboris commodo.</p><p>Laborum ut in non consectetur mollit ea laborum deserunt ut commodo proident quis.</p>', price: 'R$ 69,99/mês', image: '/assets/img/armas/pacote.png' },
                '6007': { code: '6007', title: 'Arma 7', description: '<p>Descrição do arma 7</p><p>Labore ullamco labore qui labore ut ut qui laboris quis aliquip cupidatat.</p><p>Sunt eu anim proident ex aute duis proident.</p>', price: 'R$ 79,99/mês', image: '/assets/img/armas/pacote.png' },
                '6008': { code: '6008', title: 'Arma 8', description: '<p>Descrição do arma 8</p><p>Deserunt Lorem id ea ea adipisicing nulla occaecat non veniam.</p><p>Exercitation voluptate magna esse ad consectetur pariatur tempor quis sunt sunt.</p>', price: 'R$ 89,99/mês', image: '/assets/img/armas/pacote.png' },
                '6009': { code: '6009', title: 'Arma 9', description: '<p>Descrição do arma 9</p><p>Sit elit in culpa exercitation ut.</p><p>Culpa quis fugiat sunt proident fugiat sint enim officia aliqua do culpa adipisicing.</p>', price: 'R$ 99,99/mês', image: '/assets/img/armas/pacote.png' },
                '6010': { code: '6010', title: 'Arma 10', description: '<p>Descrição do arma 10</p><p>Nisi qui occaecat non laboris culpa irure reprehenderit eu ut ut laboris anim irure.</p><p>Tempor enim laborum aliqua qui non labore elit ad duis amet voluptate.</p>', price: 'R$ 109,99/mês', image: '/assets/img/armas/pacote.png' },
            },
        },
        'remover-punicoes': {
            items: {
                '7001': { code: '7001', title: 'Item 1', description: '<p>Descrição do item 1</p><p>Laborum sit veniam veniam deserunt.</p><p>Non do aute duis excepteur.</p>', price: 'R$ 19,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7002': { code: '7002', title: 'Item 2', description: '<p>Descrição do item 2</p><p>Est do in ullamco fugiat irure adipisicing sint labore nulla consequat consectetur.</p><p>Laborum amet voluptate ipsum ullamco consectetur nisi sint adipisicing.</p>', price: 'R$ 29,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7003': { code: '7003', title: 'Item 3', description: '<p>Descrição do item 3</p><p>Aute qui adipisicing officia ex culpa nulla mollit magna sunt veniam.</p><p>Magna aute sunt cillum proident cupidatat dolore nisi.</p>', price: 'R$ 39,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7004': { code: '7004', title: 'Item 4', description: '<p>Descrição do item 4</p><p>Enim consectetur fugiat dolore velit exercitation occaecat.</p><p>Laborum ea enim anim velit commodo.</p>', price: 'R$ 49,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7005': { code: '7005', title: 'Item 5', description: '<p>Descrição do item 5</p><p>Sunt officia ipsum velit irure nulla occaecat tempor consequat mollit ut nostrud eiusmod.</p><p>Consequat qui sint occaecat nulla amet duis sit voluptate esse excepteur cupidatat.</p>', price: 'R$ 59,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7006': { code: '7006', title: 'Item 6', description: '<p>Descrição do item 6</p><p>Do ea velit esse voluptate et aute ipsum duis fugiat dolore.</p><p>Et nostrud incididunt enim dolor aliqua culpa.</p>', price: 'R$ 69,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7007': { code: '7007', title: 'Item 7', description: '<p>Descrição do item 7</p><p>Laborum proident excepteur proident ad excepteur amet occaecat proident occaecat et consectetur in.</p><p>Amet reprehenderit ad nisi ex ad veniam esse ullamco.</p>', price: 'R$ 79,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7008': { code: '7008', title: 'Item 8', description: '<p>Descrição do item 8</p><p>Eu ullamco officia ad labore magna ad duis sint fugiat excepteur laboris.</p><p>Ut enim laboris mollit est labore enim reprehenderit enim veniam ut excepteur duis.</p>', price: 'R$ 89,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7009': { code: '7009', title: 'Item 9', description: '<p>Descrição do item 9</p><p>Ut irure ad Lorem deserunt ipsum ut qui ad nisi quis laborum magna.</p><p>Consectetur ex aute qui ullamco amet sint ipsum voluptate eiusmod.</p>', price: 'R$ 99,99/mês', image: '/assets/img/punicoes/1adv.png' },
                '7010': { code: '7010', title: 'Item 10', description: '<p>Descrição do item 10</p><p>Dolor commodo id Lorem nostrud ut nulla.</p><p>Adipisicing aliqua proident voluptate nisi enim aute sit mollit consequat in ipsum cupidatat.</p>', price: 'R$ 109,99/mês', image: '/assets/img/punicoes/1adv.png' },
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
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3">
                <div class="panel panel-list">
                    <div class="panel-body">
                        <img src="${item.image}" class="img-responsive">

                        <p class="text-center">
                            ${item.title}
                        </p>
                    </div>

                    <div class="panel-footer">
                        <div class="row">
                            <div class="col-xs-12 col-sm-6">
                                <button class="btn btn-dark-3 btn-block act-open-details" data-page="${page_id}" data-code="${item.code}">Detalhes</button>
                                <div class="hidden-sm hidden-md hidden-lg"><br></div>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <button class="btn btn-purple btn-block">Eu quero</button>
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

        console.log('item', item);

        $('#modalDetailsLabel').text(`${item.title} - Código ${code}`);

        $('#modalDetailsBody').html(`
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
                Exemplo de mensagem:
            </p>

            <blockquote>
                Olá, gostaria de fazer o meu donate para o item de código ${code}
            </blockquote>
        `);

        $('#modalDetails').modal();
    }).eq(10).trigger('click');

});